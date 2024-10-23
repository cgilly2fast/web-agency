import moment, { Moment } from 'moment-timezone'
import { Fragment, useState } from 'react'
import TimeSlotsPicker from './TimeSlotPicker'
import DayPicker from './DayPicker'

interface MobileTimeSlotPickerProps {
  selectedDate: null | Moment
  setSelectedDate: (date: null | Moment) => void
  turnOffDayPicker?: boolean
  turnOffTimeSlotPicker?: boolean
  userTimezone: string
  selectedTime: string | null
  setSelectedTime: (time: string | null) => void
}
const MobileTimeSlotPicker: React.FC<MobileTimeSlotPickerProps> = ({
  selectedDate,
  setSelectedDate,
  turnOffDayPicker,
  turnOffTimeSlotPicker,
  selectedTime,
  setSelectedTime,
}) => {
  const userTimezone = moment.tz.guess()

  const handleDateClick = (isAvailable: boolean, date: Moment) => {
    if (isAvailable) {
      setSelectedDate(date)
      setSelectedTime(null)
    }
    return null
  }

  return (
    <Fragment>
      {selectedDate && (
        <Fragment>
          <div className="mb-6 p-6 border-b-[1px] border-slate-200 border-solid text-center">
            <button
              onClick={() => setSelectedDate(null)}
              className={`p-2 rounded-full bg-blue-50 hover:bg-blue-200 absolute top-[20px] left-[20px]`}
            >
              ←
            </button>
            <h1 className="text-[18px] font-bold mb-4 md:text-left">
              {selectedDate!.format('dddd')}
            </h1>
            <div className="">{selectedDate!.format('MMMM D, YYYY')}</div>
            <div>{userTimezone}</div>
          </div>
          <div className="mb-6 px-6 text-center">
            <h2 className="text-[22px] font-semibold mb-4 ">Select a Time</h2>
            <div>Duration: 20 min</div>
          </div>
          <div className="flex flex-grow gap-4 justify-center lg:justify-start text-[16px]  pb-[45px] p-6">
            <TimeSlotsPicker
              userTimezone={userTimezone}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              selectedDate={selectedDate}
            />
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default MobileTimeSlotPicker
