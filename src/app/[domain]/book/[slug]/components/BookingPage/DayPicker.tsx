import moment, { Moment } from 'moment-timezone'
import { useState } from 'react'

interface DayPickerProps {
  selectedDate: null | Moment
  userTimezone: string
  setSelectedTime: (time: null | string) => void
  handleDateClick: (isAvailable: boolean, date: Moment) => void
}
const DayPicker: React.FC<DayPickerProps> = ({ selectedDate, userTimezone, handleDateClick }) => {
  const [monthIndex, setMonthIndex] = useState(0)
  const [currentDate, setCurrentDate] = useState(moment().tz(userTimezone))

  const navigateMonth = (direction: number) => {
    if (direction < 0 && monthIndex === 0) {
      return
    }
    setMonthIndex(monthIndex + direction)
    setCurrentDate(moment(currentDate).add(direction, 'month'))
  }

  const getDaysInMonth = (date: Moment) => {
    return date.daysInMonth()
  }

  const generateDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = moment(currentDate).startOf('month').day()
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`} className="p-2"></td>)
    }

    const today = moment().tz(userTimezone).format('YYYY-MM-DD')

    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment(currentDate).date(day)
      const isToday = today === date.format('YYYY-MM-DD')
      const isSelected = selectedDate?.format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
      const isAvailable = date.isSameOrAfter(today)

      days.push(
        <td key={day} className="text-center w-fit">
          <button
            onClick={() => handleDateClick(isAvailable, date)}
            className={`w-8 h-8 rounded-full flex flex-col items-center justify-center ${
              !isAvailable && 'cursor-default'
            }  ${isAvailable && !isSelected && 'bg-blue-50 hover:bg-blue-200 text-blue-500'}
              ${isSelected && 'bg-blue-500 text-white'} ${''}`}
          >
            <span>{day}</span>
            <span
              className={`${isToday ? 'block' : 'hidden'} w-[2px] h-[2px] absolute mt-[-12px] ml-[-4px]`}
            >
              .
            </span>
          </button>
        </td>,
      )
    }

    return days
  }

  const weeks = []
  const days = generateDays()
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div className={`${selectedDate ? 'w-[60%]' : 'lg:w-full max-w-[340px] w-full'}`}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className={`p-2 rounded-full ${monthIndex > 0 && 'bg-blue-50 hover:bg-blue-200'}`}
        >
          ←
        </button>
        <span className="font-medium">{currentDate.format('MMMM YYYY')}</span>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 bg-blue-50 hover:bg-gray-200 rounded-full"
        >
          →
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <th key={day} className=" text-sm font-medium text-gray-600">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>{week}</tr>
          ))}
        </tbody>
      </table>

      <p className="text-gray-600 mt-6">Timezone: {userTimezone}</p>
    </div>
  )
}

export default DayPicker
