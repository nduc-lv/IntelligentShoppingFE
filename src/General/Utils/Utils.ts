export const Utils = {
  calculateDaysRemaining: (targetDateString: string) => {
    const targetDate = new Date(targetDateString);
    const currentDate = new Date();

    // Đặt thời gian về nửa đêm để chỉ so sánh ngày
    targetDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    // Tính số ngày còn lại
    const differenceInTime = targetDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

    return daysRemaining;
  },

  formatDateTime: (isoDateString: any) => {
    const date = new Date(isoDateString);

    // Lấy các phần của ngày, giờ, phút, giây
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Ghép chuỗi thành định dạng mong muốn
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
};