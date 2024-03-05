package sumPower

type Record struct {
	ActivePower int `json:"active_power"`
	PowerInput  int `json:"power_input"`
}

func (r Record) CalPower() int {
	return r.ActivePower + r.PowerInput
}