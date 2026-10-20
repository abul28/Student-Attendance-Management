/**
 * Student Attendance Management System
 * Client-Side JavaScript Enhancements
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Auto dismiss alert messages after 5 seconds
  const alerts = document.querySelectorAll('.alert-dismissible');
  alerts.forEach(function (alert) {
    setTimeout(function () {
      const bsAlert = new bootstrap.Alert(alert);
      try {
        bsAlert.close();
      } catch (e) {}
    }, 5000);
  });

  // 2. Real-time client-side search filter for tabular views
  const tableSearchInput = document.getElementById('tableSearchInput');
  if (tableSearchInput) {
    tableSearchInput.addEventListener('input', function () {
      const filter = this.value.toLowerCase().trim();
      const rows = document.querySelectorAll('.searchable-table tbody tr');

      rows.forEach(function (row) {
        const text = row.textContent.toLowerCase();
        if (text.includes(filter)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // 3. Attendance quick-select actions ("Mark All Present" & "Mark All Absent")
  const btnAllPresent = document.getElementById('btnMarkAllPresent');
  if (btnAllPresent) {
    btnAllPresent.addEventListener('click', function () {
      const presentRadios = document.querySelectorAll('input[type="radio"][value="Present"]');
      presentRadios.forEach(function (radio) {
        radio.checked = true;
      });
      showTransientToast("All students marked Present! Don't forget to click 'Save Attendance'.", "success");
    });
  }

  const btnAllAbsent = document.getElementById('btnMarkAllAbsent');
  if (btnAllAbsent) {
    btnAllAbsent.addEventListener('click', function () {
      const absentRadios = document.querySelectorAll('input[type="radio"][value="Absent"]');
      absentRadios.forEach(function (radio) {
        radio.checked = true;
      });
      showTransientToast("All students marked Absent! Don't forget to click 'Save Attendance'.", "warning");
    });
  }

  // 4. Quick Date Jump on Datepicker change
  const attendanceDateInput = document.getElementById('attendanceDatePicker');
  if (attendanceDateInput) {
    attendanceDateInput.addEventListener('change', function () {
      const newDate = this.value;
      if (newDate) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('date', newDate);
        window.location.href = currentUrl.toString();
      }
    });
  }
});

/**
 * Shows a light notification banner at top of screen
 */
function showTransientToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toastDiv = document.createElement('div');
  toastDiv.className = `alert alert-${type} alert-dismissible fade show shadow-sm`;
  toastDiv.innerHTML = `
    <span>${message}</span>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  container.prepend(toastDiv);

  setTimeout(function () {
    try {
      const bsToast = new bootstrap.Alert(toastDiv);
      bsToast.close();
    } catch (e) {}
  }, 4000);
}
