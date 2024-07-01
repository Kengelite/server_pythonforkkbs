const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

app.post('/run-python', (req, res) => {
  const code = req.body.code;

  // สร้างไฟล์ชั่วคราว
  const filePath = path.join(__dirname, 'temp.py');

  fs.writeFile(filePath, code, (err) => {
    if (err) {
      return res.json({ output: '', error: 'Error writing file' });
    }

    exec(`python3 ${filePath}`, (error, stdout, stderr) => {
      // ลบไฟล์ชั่วคราวหลังจากรันเสร็จ
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting temporary file', unlinkErr);
        }
      });

      if (error) {
        res.json({ output: '', error: stderr });
      } else {
        res.json({ output: stdout, error: '' });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});