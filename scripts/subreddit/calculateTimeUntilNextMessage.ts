// @ts-nocheck
export const calculateTimeUntilNextMessage = (
	now: Date,
	TIME: { day: number; hour: string }
) => {
	const { day, hour } = TIME
	if (!day) {
		return calculateTimeUntilNextDailyMessage(now, TIME)
	}
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

// @ts-nocheck
const calculateTimeUntilNextDailyMessage = (
	now: Date,
	TIME_OF_DAILY_MESSAGE: { hour: string }
) => {
	const { hour } = TIME_OF_DAILY_MESSAGE
	const [hourStr, minuteStr] = hour.split(":").map(Number)

	// Cria uma nova data com o mesmo dia/hora/minuto/segundo do "now"
	const nextMessage = new Date(now)
	nextMessage.setHours(hourStr)
	nextMessage.setMinutes(minuteStr)
	nextMessage.setSeconds(0)
	nextMessage.setMilliseconds(0)

	// Se o horário já passou no dia atual, ajusta para o próximo dia
	if (nextMessage.getTime() <= now.getTime()) {
		nextMessage.setDate(nextMessage.getDate() + 1)
	}

	const timeUntilNextMessage = nextMessage.getTime() - now.getTime()
	return timeUntilNextMessage
}
