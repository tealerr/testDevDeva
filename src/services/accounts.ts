import { Request, Response } from "express";

type user = {
  id: String;
  f_name: String;
  l_name: String;
  gender: String;
  birth_date: String;
};

var users: user[] = [
  {
    id: "1",
    f_name: "Somsak",
    l_name: "Deemak",
    gender: "Male",
    birth_date: "13/06/2000",
  },
  {
    id: "2",
    f_name: "Manee",
    l_name: "DeeDee",
    gender: "Female",
    birth_date: "21/01/2001",
  },
];

export function getAllUser(res: Response) {
  // ส่งข้อมูลของ user ทั้งหมดที่ mock ไว้
  res.json(users);
}

export function findUser(req: Request, res: Response) {
  // รับชื่อหรือนามสกุลของผู้ใช้จากพารามิเตอร์ nameSurname ใน URL
  const nameSurname = req.params.nameSurname;
  // ตรวจสอบว่ามีชื่อหรือนามสกุลหรือไม่
  if (!nameSurname) {
    res.status(400).json({ message: "Name/Surname parameter is required" });
    return;
  }
  // ค้นหาผู้ใช้จากชื่อที่ใส่เข้ามาผ่าน url
  const foundUsers = users.filter(
    (user) =>
      user.f_name.includes(nameSurname) || user.l_name.includes(nameSurname)
  );

  if (foundUsers.length === 0) {
    res
      .status(404)
      .json({ message: "No users found with the specified name/surname" });
    return;
  }

  res.status(200).json(foundUsers);
}

export function addUser(req: Request, res: Response) {
  // กำหนด field ที่ต้องการ ของ req body
  const { id, f_name, l_name, gender, birth_date } = req.body;

  // เช็ึค field ว่าส่งมาครบหรือไม่
  if (!id || !f_name || !l_name || !gender || !birth_date) {
    res.status(400).json({ message: "Missing required field !" });
    return;
  }

  // ถ้า user id ซ้ำ ให้แจ้ง error กลับไป
  const existingUser = users.find((user) => user.id === id);
  if (existingUser) {
    res.status(400).json({ message: "User with the same ID already exists" });
    return;
  }

  // สร้าง object ใหม่ของ user
  const newUser: user = {
    id,
    f_name,
    l_name,
    gender,
    birth_date,
  };

  // เพิ่มผู้ใช้ใหม่เข้าไปในอาร์เรย์ users
  users.push(newUser);

  res.status(201).json({ message: "User added successfully", user: newUser });
}

export function updateUser(req: Request, res: Response) {
  // รับพารามิเตอร์ userId จาก URL
  const userId = req.params.id;
  // รับข้อมูลที่จะอัพเดทผ่าน body
  const { f_name, l_name, gender, birth_date } = req.body;

  // ค้นหา index ของผู้ใช้ในอาร์เรย์ users
  const userIndex = users.findIndex((user) => user.id === userId);

  // ถ้าไม่พบผู้ใช้ ให้ส่งข้อความแจ้งว่าไม่พบผู้ใช้
  if (userIndex === -1) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // อัปเดตข้อมูลผู้ใช้
  users[userIndex] = {
    ...users[userIndex],
    f_name: f_name || users[userIndex].f_name,
    l_name: l_name || users[userIndex].l_name,
    gender: gender || users[userIndex].gender,
    birth_date: birth_date || users[userIndex].birth_date,
  };

  res
    .status(200)
    .json({ message: "User updated successfully", user: users[userIndex] });
}

export function deleteUser(req: Request, res: Response) {
  // รับ user id ผ่าน param
  const userId = req.params.id;

  // ค้นหา index ของผู้ใช้ในอาร์เรย์ users
  const index = users.findIndex((user) => user.id === userId);

  // ถ้าพบผู้ใช้ ลบออกจากอาร์เรย์ users
  if (index !== -1) {
    users.splice(index, 1);
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    // ถ้าไม่เจอ user จะส่ง 404 not found
    res.status(404).json({ message: "User not found" });
  }
}
