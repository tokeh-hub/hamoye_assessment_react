import React,{useState} from 'react'
import DateTimePicker from 'react-datetime-picker'

const DashboardDesign = () => {
    const [date,setDate] = useState(new Date())

  return (
    <div class="flex h-screen bg-gray-200">
  <div class="hidden w-64 bg-gray-800 md:block">
    <div class="p-6">
      <h2 class="text-white text-2xl font-bold">Dashboard</h2>
    </div>
    <nav class="flex-grow">
      <ul class="p-6">
        <li class="mb-2">
          <a href="#" class="block text-gray-300 hover:text-white">Home</a>
        </li>
        <li class="mb-2">
          <a href="#" class="block text-gray-300 hover:text-white">Profile</a>
        </li>
        <li class="mb-2">
          <a href="#" class="block text-gray-300 hover:text-white">Settings</a>
        </li>
      </ul>
    </nav>
  </div>
  <div class="flex-grow p-6">
    <h2 class="text-2xl font-bold mb-4">Welcome to your dashboard</h2>
    {/* <DateTimePicker onChange={onChange} value={value} /> */}
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at enim in leo lobortis euismod.</p>
  </div>
</div>

  )
}

export default DashboardDesign