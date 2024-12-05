export const MockRoutes = {
    getNatureData: '/assets/data/nature.json',
    geCultureData: '/assets/data/culture.json',
    getCultureData: '/assets/data/activityCards.json',
    getAdminEntryData: '/assets/data/tablentry.json',
    generateOtp: '/v1/generateOTP',
}
export const ApiRoutes = {
    natureData: "/v1/nature/getdata",
    cultureData: "/v1/culture/getdata",
    foodData: "/v1/food/getdata",
    storyData: "/v1/blogs/getBlogs"
};
export const Environment = {
    local: 'http://localhost:4200',
    production: 'https://udupi-darshan-be.onrender.com',
    routes: ApiRoutes
}
