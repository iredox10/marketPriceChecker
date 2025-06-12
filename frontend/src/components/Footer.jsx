import { useState, useEffect } from 'react'
const Footer = () => {
  const [time, setTime] = useState(new Date());

  // Effect to update the time every second
  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId); // Cleanup interval on component unmount
  }, []);

  // Format time for the Nigerian timezone
  const nigerianTime = time.toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' });

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} Kano Price Checker. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-2">
          Made with <span className="text-red-500">&hearts;</span> in Kano. Current time in Nigeria: {nigerianTime}
        </p>
      </div>
    </footer>
  );
}
export default Footer
