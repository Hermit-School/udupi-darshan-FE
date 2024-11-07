export const MockRoutes = {
    getNatureData: '/assets/data/nature.json',
    geCultureData: '/assets/data/culture.json',
    getCultureData: '/assets/data/activityCards.json',
    getAdminEntryData: '/assets/data/tablentry.json'
}
export const ApiRoutes = {
    natureData: "/v1/nature/getdata",
    cultureData: "/v1/culture/getdata"
};
export const Environment = {
    local: 'http://localhost:4200',
    production: 'https://udupi-darshan-be.onrender.com',
    routes: ApiRoutes
}
