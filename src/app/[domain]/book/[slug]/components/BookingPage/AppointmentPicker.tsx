import moment, { Moment } from 'moment-timezone'
import { useState } from 'react'
import TimeSlotPicker from './TimeSlotPicker'
import DayPicker from './DayPicker'

interface AppointmentPickerProps {
  selectedDate: null | Moment
  setSelectedDate: (date: null | Moment) => void
  userTimezone: string
  turnOffDayPicker?: boolean
  turnOffTimeSlotPicker?: boolean
  selectedTime: string | null
  setSelectedTime: (time: string | null) => void
}
const AppointmentPicker: React.FC<AppointmentPickerProps> = ({
  selectedDate,
  setSelectedDate,
  turnOffDayPicker,
  turnOffTimeSlotPicker,
  userTimezone,
  selectedTime,
  setSelectedTime,
}) => {
  const handleDateClick = (isAvailable: boolean, date: Moment) => {
    if (isAvailable) {
      setSelectedDate(date)
      setSelectedTime(null)
    }
    return null
  }

  return (
    <div
      className={`border-t-[1px] lg:border-t-[0px] lg:border-l-[1px] border-slate-200 border-solid ${selectedDate ? 'lg:w-[65%]' : 'lg:w-[50%]'} pl-6 pr-6 pt-6 lg:flex lg:flex-col pb-[45px] lg:pb-0 `}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-center lg:text-start">
          {!selectedDate ? 'Select a Day' : 'Select a Date & Time'}
        </h2>
      </div>
      <div className="flex flex-grow gap-4 justify-center lg:justify-start text-[16px]">
        {!turnOffDayPicker && (
          <DayPicker
            selectedDate={selectedDate}
            userTimezone={userTimezone}
            setSelectedTime={setSelectedTime}
            handleDateClick={handleDateClick}
          />
        )}

        {!turnOffTimeSlotPicker && (
          <TimeSlotPicker
            userTimezone={userTimezone}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </div>
  )
}

export default AppointmentPicker
