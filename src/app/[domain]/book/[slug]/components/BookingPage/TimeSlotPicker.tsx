import moment, { Moment } from 'moment'
import { Fragment } from 'react'

interface TimeSlotPickerProps {
  userTimezone: string
  selectedTime: string | null
  selectedDate: null | Moment
  setSelectedTime: (time: string | null) => void
}
const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  selectedTime,
  userTimezone,
  setSelectedTime,
}) => {
  const generateTimeSlots = () => {
    const slots: string[] = []
    const startHour = 9 // 9 AM
    const endHour = 16 // 4 PM
    const intervals = [0, 15, 30, 45] // 15-minute intervals

    for (let hour = startHour; hour <= endHour; hour++) {
      intervals.forEach((minutes) => {
        // Skip 4:15, 4:30, 4:45 PM slots
        if (hour === endHour && minutes > 0) return

        const time = moment().tz(userTimezone).hour(hour).minute(minutes)
        slots.push(time.format('h:mm A'))
      })
    }

    return slots
  }

  const timeSlots = generateTimeSlots()

  return (
    <Fragment>
      {selectedDate && (
        <div className="w-full md:w-[40%] flex flex-col h-full">
          <h3 className="hidden md:block text-[16px] mb-4 text-center md:text-left">
            {selectedDate.format('dddd, MMMM D')}
          </h3>

          <div className="flex-1 lg:basis-[100px] overflow-auto">
            <div className="space-y-2 pb-[15px]">
              {timeSlots.map((time) => (
                <div key={time} className="flex">
                  <button
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 text-center rounded  ${
                      selectedTime === time
                        ? 'bg-slate-500 text-white w-1/2 mr-[6px]'
                        : 'border-[2px] border-solid w-full hover:border-[2px] hover:border-solid hover:border-blue-500'
                    }`}
                  >
                    {time}
                  </button>
                  <button
                    className={`${
                      selectedTime === time
                        ? 'block w-1/2 bg-blue-500 text-white rounded'
                        : 'hidden'
                    }`}
                  >
                    Next
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  )
}
export default TimeSlotPicker
