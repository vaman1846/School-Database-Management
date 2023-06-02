const express = require("express");
const mysql = require("mysql2");

const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "new",
// });
// connection.connect((err) => {
//   if (err) {
//     console.log(`Db is not connected`);
//   } else {
//     console.log(`Db is connected`);
//   }
// });



function connectWithRetry() {
  const connection = mysql.createConnection({
    host: 'geecomindia.in',
    port: 8088,
    user: 'geecol1b',
    password: '',
    database: 'geecomDemo',
    connectTimeout: 3000,
    authPlugins: {
      // mysql_clear_password: () => () => Buffer.from(password + '\0')
    }
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      console.log('Retrying connection...');
      setTimeout(connectWithRetry, 2000); // Retry after 2 seconds
      return;
    }
    console.log('Connected to the database');
  });
}

connectWithRetry();

// students ...............

app.post("/students", (req, res) => {
  const {
    student_id,
    first_name,
    last_name,
    date_of_birth,
    address,
    contact_number,
  } = req.body;
  const query =
    "INSERT INTO Students (student_id, first_name, last_name, date_of_birth, address, contact_number) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(
    query,
    [student_id, first_name, last_name, date_of_birth, address, contact_number],
    (err, result) => {
      if (err) {
        console.log("Err");
        res.status(500).send({ message: "Student details does not exists" });
        return;
      }
      res.status(201).json({ message: "Student created successfully" });
    }
  );
});

// parents................

app.post("/parents", (req, response) => {
  const { parent_id, father_name, mother_name, address, contact_number, student_id } = req.body;
  const query =
    "INSERT INTO parents (parent_id, father_name, mother_name, address, contact_number, student_id) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(
    query,
    [parent_id, father_name, mother_name, address, contact_number, student_id],
    (err, result) => {
      if (err) {
        console.log(err);
        return response.status(500).send({ message: "Failed to save student's parent details" });
      } else {
        response.status(200).json({ message: "Student's parent details saved successfully" });
      }
    }
  );
});


// student parents..............

app.post("/student_parents", (req, res) => {
  const { student_id, parent_id } = req.body;
  const query =
    "INSERT INTO student_parents (student_id, parent_id) VALUES (?, ?);";
  connection.query(query, [student_id, parent_id], (err, result) => {
    if (err) {
      console.log("Err");
      res.status(500).send({ message: "Details are not entered" });
      return;
    } else {
      res
        .status(201)
        .json({ message: "Student-Parent relationship created successfully" });
    }
  });
});

// teacher table .....................

app.post("/teachers", (req, res) => {
  const { teacher_id, teacher_name, contact_number } = req.body;
  const query =
    "INSERT INTO Teachers (teacher_id, teacher_name, contact_number) VALUES (?, ?, ?)";
  connection.query(
    query,
    [teacher_id, teacher_name, contact_number],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error" });
      } else {
        res.status(201).json({ message: "Teacher created successfully" });
      }
    }
  );
});

// class section .........................
app.post("/section", (req, res) => {
  const { section_id, section_name } = req.body;
  const query = "INSERT INTO section (section_id, section_name) VALUES (?, ?)";
  connection.query(query, [section_id, section_name], (err, result) => {
    if (err) {
      console.log("Err");
      return express.response
        .status(500)
        .json({ message: "Details no Entered" });
    } else {
      res.status(201).json({ message: "Section created successfully" });
    }
  });
});

// classes ....................

app.post("/classes", (req, res) => {
  const { class_id, class_name, teacher_id, student_id } = req.body;
  const query =
    "INSERT INTO Classes ( class_id, class_name, teacher_id, student_id, section_id) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    query,
    [class_id, class_name, teacher_id, student_id], 
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error" });
      } else {
        res.status(201).json({ message: "Class created successfully" });
      }
    }
  );
});

// subjects ................

app.post("/subjects", (req, res) => {
  const { subject_id, subject_name } = req.body;
  const query =
    "INSERT INTO Subjects ( subject_id, subject_name) VALUES (?, ?)";
  connection.query(query, [subject_id, subject_name], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: "Internal server error" });
    } else {
      res.status(201).json({ message: "Subject created successfully" });
    }
  });
});

// grade .......result..................

app.post("/grades", (req, res) => {
  const {
    grade_id,
    student_id,
    class_id,
    subject_id,
    grade_value,
    total_grade_value,
  } = req.body;
  const query =
    "INSERT INTO Grades ( grade_id, student_id, class_id, subject_id, grade_value, total_grade_value) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(
    query,
    [
      grade_id,
      student_id,
      class_id,
      subject_id,
      grade_value,
      total_grade_value,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error" });
      } else {
        res.status(201).json({ message: "Grade created successfully" });
      }
    }
  );
});

// Fee table
app.post("/fees", (req, res) => {
  const {
    fee_id,
    student_id,
    class_id,
    fee_amount,
    payment_date,
    payment_status,
  } = req.body;
  const query =
    "INSERT INTO fee ( fee_id, student_id, class_id, fee_amount, payment_date, payment_status) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(
    query,
    [fee_id, student_id, class_id, fee_amount, payment_date, payment_status],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error" });
      } else {
        res.status(201).json({ message: "Fee created successfully" });
      }
    }
  );
});

// Attendance table................

app.post("/attendance", (req, res) => {
  const {
    attendance_id,
    student_id,
    class_id,
    attendance_date,
    attendane_status,
  } = req.body;
  const query =
    "INSERT INTO attendance (attendance_id, student_id,class_id,attendance_date, attendane_status) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    query,
    [attendance_id, student_id, class_id, attendance_date, attendane_status],
    (err, result) => {
      if (err) {
        console.log("Err");
        return express.response
          .status(500)
          .json({ message: "Attendance Details are not Entered" });
      } else {
        res.status(201).json({ message: "Attendance created successfully" });
      }
    }
  );
});

// ....................................TO ENTER FEE DETAILS..................

app.post("/students/fees/:studentId", (req, res) => {
  const { fm_id, class_id, amount } = req.body;
  const query = `
              INSERT INTO fee_master (fm_id, class_id, amount)
              VALUES (?, ?, ?)
              `;
  connection.query(query, [fm_id, class_id, amount], (err, result) => {
    if (err) {
      console.log("Err");
      return response
        .status(500)
        .json({ message: "fee master are no Entered" });
    } else {
      res.status(201).json({ message: "fee master created successfully" });
    }
  });
});

// ...............................TO ENTER FEE PAYMENT DETAILS...............
app.post("/students/fees/payment/:studentId", (req, res) => {
  const { fp_id, fm_id, studentId, amount, payment_date } = req.body;
  const query = ` INSERT INTO FEE_PAYMENT (fp_id, fm_id, student_id, amount, payment_date)
                  VALUES (?, ?, ?, ?, ?)
       `;
  connection.query(
    query,
    [fp_id, fm_id, studentId, amount, payment_date],
    (err, result) => {
      if (err) {
        console.log("Err");
        return response
          .status(500)
          .json({ message: "fee master are no Entered" });
      } else {
        res.status(201).json({ message: "fee master created successfully" });
      }
    }
  );
});

//.......................................GET METHOD .........................

// Student table................
app.get("/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  const query = "SELECT * FROM Students WHERE student_id = ?";
  connection.query(query, [studentId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// student parent detail ....................

app.get("/students/:studentId/parents", (req, res) => {
  const studentId = req.params.studentId;

  const query = `
      SELECT Students.*, Parents.*
      FROM Students
      JOIN student_parents ON Students.student_id = student_parents.student_id
      JOIN Parents ON student_parents.parent_id = Parents.parent_id
      WHERE Students.student_id = ?`;

  connection.query(query, [studentId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// student parent name and contact details.....................
app.get("/students/:studentId/parents/name", (req, res) => {
  const studentId = req.params.studentId;
  const query = `
        SELECT Parents.first_name, Parents.last_name, Parents.contact_number
        FROM Students
        JOIN student_parents ON Students.student_id = student_parents.student_id
        JOIN Parents ON student_parents.parent_id = Parents.parent_id
        WHERE Students.student_id=? `;

  connection.query(query, [studentId], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal Server Error" });
    } else {
      return res.json(results);
    }
  });
});

// student class detail .............
app.get("/students/:studentId/classes", (req, res) => {
  const studentId = req.params.studentId;
  const query = `
  SELECT classes.class_name, sections.section_name
  FROM classes 
  JOIN students_classes ON classes.class_id = students_classes.class_id
  JOIN sections ON classes.section_id = sections.section_id
  WHERE students_classes.student_id = ?;
   `;
  connection.query(query, [studentId], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal Server Error" });
    } else {
      return res.json(results);
    }
  });
});

// student fee detail .............
// app.get("/students/:studentId/fees", (req, res) => {
//   const studentId = req.params.studentId;
//   const query = `
//               SELECT Students.*, Fee.fee_amount, Fee.payment_date, Fee.payment_status
//               FROM Students
//               JOIN Fee ON Students.student_id = Fee.student_id
//               WHERE Students.student_id = ?
//   `;
//   connection.query(query, [studentId], (error, results) => {
//     if (error) {
//       console.log(error);
//       return res.status(500).send({ message: "Internal Server Error" });
//     } else {
//       return res.json(results);
//     }
//   });
// });

// TO FIND FEE STATUS CCORDING
app.get("/api/fee-status/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  // Execute the SQL query
  const query = `
    SELECT
      fp.student_id,
      CASE
        WHEN COALESCE(SUM(fp.amount), 0) >= MAX(fm.amount) THEN 'Paid'
        ELSE 'Unpaid'
      END AS status
    FROM
      fee_payment fp
    JOIN
      fee_master fm ON fp.fm_id = fm.fm_id
    WHERE
      fp.student_id = ?
    GROUP BY
      fp.student_id, fm.amount;
  `;
  connection.query(query, [studentId], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal Server Error" });
    } else {
      return res.json(results);
    }
  });
});

//.............TO FIND REMAINING FEE ............

app.get("/api/remaining-fee/:studentId", (req, res) => {
  const studentId = req.params.studentId;
  const query = `
   SELECT
    fp.student_id,
    CASE
        WHEN COALESCE(SUM(fp.amount), 0) >= fm.amount THEN 'Paid'
        ELSE 'Unpaid'
    END AS status,
    fm.amount - COALESCE(SUM(fp.amount), 0) AS remaining_fees
            FROM
    fee_payment fp
              JOIN
          fee_master fm ON fp.fm_id = fm.fm_id
      WHERE
          fp.student_id = ?
      GROUP BY
          fp.student_id, fm.amount;
      `;
  connection.query(query, [studentId], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal Server Error" });
    } else {
      return res.json(results);
    }
  });
});

// ... TO FIND PAYMENT DATE ALSO
app.get("/api/payment-date/:studentId", (req, res) => {
  const studentId = req.params.studentId;
  const query = `
              SELECT
              fp.student_id,
              CASE
                  WHEN COALESCE(SUM(fp.amount), 0) >= fm.amount THEN 'Paid'
                  ELSE 'Unpaid'
              END AS status,
              fm.amount - COALESCE(SUM(fp.amount), 0) AS remaining_fees,
              GROUP_CONCAT(DISTINCT CONCAT(fp.amount, ' - ', fp.payment_date) ORDER BY fp.payment_date) AS payment_details
                   FROM
                       fee_payment fp
                   JOIN
                       fee_master fm ON fp.fm_id = fm.fm_id
                      WHERE
                       fp.student_id = ? 
                   GROUP BY
              fp.student_id, fm.amount;    

              `;
  connection.query(query, [studentId], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal Server Error" });
    } else {
      return res.json(results);
    }
  });
});

// .................ALL STUDENT FEES DETAIL TO FIND.........

app.get("/api/fees-detail/:studentId", (req, res) => {
  const studentId = req.params.studentId;
  const query = `
        SELECT
        fp.student_id,
        CASE
            WHEN COALESCE(SUM(fp.amount), 0) >= fm.amount THEN 'Paid'
            ELSE 'Unpaid'
        END AS status,
        fm.amount - COALESCE(SUM(fp.amount), 0) AS remaining_fees,
        GROUP_CONCAT(DISTINCT CONCAT(fp.amount, ' - ', fp.payment_date) ORDER BY fp.payment_date) AS payment_details
      FROM
        fee_payment fp
      JOIN
        fee_master fm ON fp.fm_id = fm.fm_id
      GROUP BY
        fp.student_id, fm.amount`;

  connection.query(query, [studentId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Internal Server Error" });
    } else {
      res.json(result);
    }
  });
});


// ........................student parents................

app.get('/student/parents/:student_Id',(req,res)=>{
  const student_Id = req.params.student_Id;
  const query = `
  SELECT students.student_id, students.first_name, students.last_name, students.date_of_birth, students.address, students.contact_number,
  parents.parent_id, parents.father_name, parents.mother_name, parents.address AS parent_address, parents.contact_number AS parent_contact_number
FROM students
JOIN parents ON students.student_id = parents.student_id
WHERE students.student_id = ?`;

  connection.query(query,[student_Id],(err,result)=>{
    if(err){
      console.log(err);
      return res.status(500).send({message:'Internal server Error'})
    } else {
      res.json(result)
    }
  })
})

// ..................................students attendance status ...................

app.get('/student/attendance/:student_Id',(req,res)=>{
  const student_Id = req.params.student_Id;
  const query = `
  SELECT attendance_date, attendance_status
FROM attendance
WHERE student_id = ? `;

connection.query(query,[student_Id],(err,result)=>{
  if(err){
    console.log(err);
    return response.status(500).send({message:"Internal server Error"})
} else {
  res.json(result)
}
})
})

 

//   ........................... attendance for class wise result ....................

app.get(  '/student/attendance/report/class/:student_Id',(req,res)=>{
  const student_Id = req.params.student_Id;
  const query = `SELECT students.student_id, students.first_name, students.last_name, attendance.attendance_date, attendance.attendance_status
  FROM students
  JOIN students_classes ON students.student_id = students_classes.student_id
  JOIN classes ON students_classes.class_id = classes.class_id
  JOIN attendance ON students.student_id = attendance.student_id
  WHERE classes.class_name = '8th' AND classes.section_id = ?`;
  
  connection.query(query,[student_Id],(err,result)=>{
    if(err){
      console.log(err);
      return response.status(500).send({message:"Internal server Error"})
      } else {
        res.json(result)
      }
  })
}  )



// .................... student attendance details . ........

app.get('/student/attendance/:student_Id',(req,res)=>{
  const student_Id = req.params.student_Id;
  const query = `SELECT attendance.attendance_status, COUNT(*) AS count
  FROM attendance
  WHERE attendance.student_id = ?
  GROUP BY attendance.attendance_status `;

  connection.query(query,[student_Id],(err,result)=>{
    if(err){
      console.log(err);
      return response.status(500).send({message:"Internal server Error"})
      } else {
        res.json(result)
      }
  })
} )
  



// to count ........................student present day and absent day

app.get('/student/attendance/count/:student_Id',(req,res)=>{
  const student_Id = req.params.student_Id;
  const query = `SELECT 
  SUM(CASE WHEN attendance.attendance_status = 'Present' THEN 1 ELSE 0 END) AS present_days,
  SUM(CASE WHEN attendance.attendance_status = 'Absent' THEN 1 ELSE 0 END) AS absent_days
FROM attendance
WHERE attendance.student_id = ?`;


  connection.query(query,[student_Id],(err,result)=>{
    if(err){
      console.log(err);
      return response.status(500).send({message:"Internal server Error"})
      } else {
        res.json(result)
      }
  })
} )



const PORT = 4100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});