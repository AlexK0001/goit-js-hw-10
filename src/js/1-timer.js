document.addEventListener('DOMContentLoaded', function () {
  // Initialize flatpickr
  const datetimePicker = flatpickr('#datetime-picker', {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates, dateStr, instance) {
      const selectedDate = selectedDates[0];
      if (selectedDate < new Date()) {
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
        document.getElementById('startButton').disabled = true;
      } else {
        document.getElementById('startButton').disabled = false;
      }
    }
  });

  // Countdown timer logic
  let countdownInterval;
  document.getElementById('startButton').addEventListener('click', function () {
    const selectedDate = datetimePicker.selectedDates[0];
    if (!selectedDate || selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a valid future date',
      });
      return;
    }

    // Disable input and button during countdown
    datetimePicker.destroy();
    document.getElementById('datetime-picker').disabled = true;
    this.disabled = true;

    // Start countdown
    const endTime = selectedDate.getTime();
    updateTimer(endTime);

    countdownInterval = setInterval(function () {
      updateTimer(endTime);
    }, 1000);
  });

  function updateTimer(endTime) {
    const currentTime = new Date().getTime();
    const timeLeft = endTime - currentTime;

    if (timeLeft < 0) {
      clearInterval(countdownInterval);
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      iziToast.success({
        title: 'Countdown Finished',
        message: 'The countdown has ended!',
      });
      // Enable input and button after countdown ends
      document.getElementById('datetime-picker').disabled = false;
      document.getElementById('startButton').disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    document.getElementById('days').textContent = addLeadingZero(days);
    document.getElementById('hours').textContent = addLeadingZero(hours);
    document.getElementById('minutes').textContent = addLeadingZero(minutes);
    document.getElementById('seconds').textContent = addLeadingZero(seconds);
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
});
