'use client'
import React, { Fragment, useState } from 'react'
import moment, { Moment } from 'moment-timezone'
import AppointmentInfo from './AppointmentInfo'
import AppointmentPicker from './AppointmentPicker'
import MobileTimeSlotPicker from './MobileTimeslotsPicker'

const BookingPage = () => {
  const userTimezone = moment.tz.guess()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<null | Moment>(null)

  return (
    <div className="min-h-svh flex flex-col">
      <div className=" lg:short:flex-auto lg:short:h-full lg:tall:min-h-[700px] flex justify-center md:px-[70px] md:mt-[66px] md:mb-[30px] ">
        <div
          className={`hidden bg-white rounded-lg shadow-lg md:flex flex-col lg:flex-row flex-auto min-h-[550px] border-[1px] border-slate-200 max-w-[680px] ${selectedDate ? 'lg:max-w-[1060px] lg:w-full lg:min-w-[850px]' : 'lg:max-w-[800px]'}`}
        >
          <AppointmentInfo selectedDate={selectedDate} />
          <AppointmentPicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            userTimezone={userTimezone}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        </div>
        <div
          className={`md:hidden bg-white min-h-[550px] max-w-[680px] ${selectedDate ? 'hidden' : 'flex flex-col flex-auto'}`}
        >
          <AppointmentInfo selectedDate={selectedDate} />
          <AppointmentPicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            turnOffTimeSlotPicker={true}
            userTimezone={userTimezone}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        </div>
        <div
          className={`md:hidden bg-white min-h-[550px] max-w-[680px] ${selectedDate ? 'flex flex-col flex-auto' : 'hidden'}`}
        >
          <MobileTimeSlotPicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            userTimezone={userTimezone}
            turnOffDayPicker={true}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        </div>
      </div>
    </div>
  )
}

export default BookingPage
