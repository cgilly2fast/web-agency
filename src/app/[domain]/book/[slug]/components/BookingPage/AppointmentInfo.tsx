import { Moment } from 'moment'

interface AppointmentInfoProps {
  selectedDate: null | Moment
}
const AppointmentInfo: React.FC<AppointmentInfoProps> = ({ selectedDate }) => {
  return (
    <div className={`overflow-y-auto ${selectedDate ? 'lg:w-[35%]' : 'lg:w-[50%]'} py-7`}>
      <div className="items-center justify-center pb-[25px] mb-[24px] border-b-[1px] border-solid border-slate-200 flex">
        <img
          className="size-[60px] lg:size-[120px]"
          src="https://d3v0px0pttie1i.cloudfront.net/uploads/user/logo/34814177/c0fcd6c8.png"
        />
      </div>
      <div className="flex flex-col md:items-center lg:block lg:items-start max-w-[400px] mx-auto">
        <div className="flex flex-col items-center lg:items-start">
          <img
            className="rounded-full size-[65px] lg:ml-7 lg:mb-2"
            src="https://d3v0px0pttie1i.cloudfront.net/uploads/user/avatar/34814177/578d2759.jpg"
          />
          <div className="text-[16px] px-7 ">Colby Gilbert</div>
          <h1 className="text-[28px] px-7 mb-6">Firmleads Appointment</h1>
        </div>
        <div className="md:flex lg:block justify-start text-[16px] font-bold">
          <div className="px-7 flex mb-3 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="mt-[3px] mr-2"
              viewBox="0 0 16 16"
            >
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
            </svg>
            20 min
          </div>
          <div className="px-7 flex mb-3 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="mt-[3px] mr-2"
              viewBox="0 0 16 16"
            >
              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
            </svg>
            Phone Call
          </div>
        </div>
        <p className="pl-[30px] md:px-[30px] text-[16px] max-w-[360px] md:max-w-[400px]  lg:max-w-fit">
          Feel free to call directly anytime at (415) 209-5847. If there are no slots please call or
          email colby@firmleads.io
        </p>
      </div>
    </div>
  )
}

export default AppointmentInfo
