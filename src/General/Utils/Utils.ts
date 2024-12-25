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
    }
}