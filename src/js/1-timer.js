import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.addEventListener('DOMContentLoaded', function () {
  let countdownInterval;
  const dateTimePicker = document.querySelector('#datetime-picker');
  const startButton = document.querySelector('[data-start]');
  const daysValue = document.querySelector('[data-days]'); 
  const hoursValue = document.querySelector('[data-hours]'); 
  const minutesValue = document.querySelector('[data-minutes]');
  const secondsValue = document.querySelector('[data-seconds]');
  let countdownInterval = null;
  let userSelectedDate = null; 

  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      if (selectedDate <= new Date()) {
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
        startButton.disabled = true;
      } else {
        userSelectedDate = selectedDate;
        startButton.disabled = false;
      }
    }
  };

  flatpickr(dateTimePicker, options);

  function updateTimerDisplay({ days, hours, minutes, seconds }) {
    daysValue.textContent = days;
    hoursValue.textContent = addLeadingZero(hours);
    minutesValue.textContent = addLeadingZero(minutes);
    secondsValue.textContent = addLeadingZero(seconds);
  }

  function startTimer() {
    countdownInterval = setInterval(() => {
      const now = new Date();
      const timeLeft = userSelectedDate - now;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        dateTimePicker.disabled = false;
        return;
      }

      const timeComponents = convertMs(timeLeft);
      updateTimerDisplay(timeComponents); 
    }, 1000);
  }

  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor((ms % hour) / minute);
    const seconds = Math.floor((ms % minute) / second);

    return { days, hours, minutes, seconds };
  }

  function addLeadingZero(value) {
    return value < 10 ? `0${value}` : value;
  }

  startButton.addEventListener('click', () => {
    if (!userSelectedDate || userSelectedDate <= new Date()) {
      iziToast.error({
        title: 'Помилка',
        message: 'Будь ласка, виберіть коректну дату в майбутньому',
      });
      return;
    }

    startButton.disabled = true; 
    dateTimePicker.disabled = true;
    startTimer(); 
  });

});
