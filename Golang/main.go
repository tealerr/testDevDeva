package main

import (
	"log"
	"math/rand"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

type Record struct {
	ActivePower int `json:"active_power"`
	PowerInput  int `json:"power_input"`
}

type Data struct {
	ActivePower int
	PowerInput  int
}

func main()  {
	var mockupData []Data

	// สร้าง seed จากเวลาปัจจุบัน
	seed := time.Now().UnixNano()

	// สร้าง random generator ด้วย seed
	random := rand.New(rand.NewSource(seed))
	
	for i := 0; i < 1000; i++ {
		activePower := random.Intn(1000) + 1 // สุ่มค่า activePower ในช่วง 1-1000
		powerInput := random.Intn(1000) + 1  // สุ่มค่า powerInput ในช่วง 1-1000
		data := Data{
			ActivePower: activePower,
			PowerInput:  powerInput,
		}
		mockupData = append(mockupData, data)
	}

	// สร้าง route
	app := fiber.New()
	app.Get("/query", func(c *fiber.Ctx) error {
		// อ่านค่า active_power และ power_input จาก url
		activePowerQuery := c.Query("active_power")
		powerInputQuery := c.Query("power_input")

		// แปลงค่า active_power และ power_input จาก string เป็น integer โดยใช้อาต้อย
		activePowerValue , err := strconv.Atoi(activePowerQuery)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid value for active_power",
			})
		}
		
		powerInputValue , err := strconv.Atoi(powerInputQuery)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid value for power_input",
			})
		}

		// คำนวณผลรวมของ active_power และ power_input จาก mockup database
		var sumActivePower, sumPowerInput int
		for _, data := range mockupData {
			sumActivePower += data.ActivePower
			sumPowerInput += data.PowerInput
		}

		// เอาค่าจาก query มารวมกับผลลรวมจากค่าที่ random
		sumActivePower += activePowerValue
		sumPowerInput += powerInputValue

		// สร้าง response JSON
		// กำหนดให้ response เป็น array ของ record struct ที่มีขนาด 1000
		response := make([]Record,1000)
		// loop range ของ response เพื่อ assign ค่าให้ทุก index
		for i := range response {
			// เพิ่มค่าใส่แต่ละ object ใน Record array
			response[i] = Record{ActivePower: sumActivePower, PowerInput: sumPowerInput}
		}

		// ส่ง response กลับไปยัง client
		return c.JSON(response)
	})

	// เริ่มต้นเซิร์ฟเวอร์
	log.Fatal(app.Listen(":3000"))
	
}

//http://localhost:3000/query?active_power=200&power_input=2000

// fmt.Println("Hello World")
	// record := sumPower.Record{ActivePower: 520, PowerInput: 100}
	// totalPower := record.CalPower()
	// fmt.Println("Total power:", totalPower)

	// var response []Record
	// 	for i := 0; i < 3; i++ {
	// 		response = append(response, Record{ActivePower: sumActivePower, PowerInput: sumPowerInput})
	// 	}