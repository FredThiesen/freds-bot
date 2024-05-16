export const calculateTimeUntilNextMessage = (
	now: Date,
	TIME_AND_DAY_OF_WEEKLY_MESSAGE: { day: number; hour: string }
) => {
	const { day, hour } = TIME_AND_DAY_OF_WEEKLY_MESSAGE
	const [hourStr, minuteStr] = hour.split(":").map(Number)

	// Cria uma nova data com o mesmo dia/hora/minuto/segundo do "now"
	const nextMessage = new Date(now)
	nextMessage.setHours(hourStr)
	nextMessage.setMinutes(minuteStr)
	nextMessage.setSeconds(0)
	nextMessage.setMilliseconds(0)

	// Calcula a diferença de dias até o próximo "day" (quinta-feira = 4)
	const dayDifference = (day + 7 - now.getDay()) % 7

	if (dayDifference === 0 && nextMessage.getTime() <= now.getTime()) {
		// Se hoje é o dia e o horário já passou, ajusta para a próxima semana
		nextMessage.setDate(nextMessage.getDate() + 7)
	} else {
		nextMessage.setDate(nextMessage.getDate() + dayDifference)
	}

	const timeUntilNextMessage = nextMessage.getTime() - now.getTime()
	return timeUntilNextMessage
}
