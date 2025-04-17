export const MockRoutes = {
    getNatureData: '/assets/data/nature.json',
    geCultureData: '/assets/data/culture.json',
    getCultureData: '/assets/data/activityCards.json',
    getAdminEntryData: '/assets/data/tablentry.json',
    generateOtp: '/v1/generateOTP',
}
export const ApiRoutes = {
    natureData: "/v1/nature/getNature",
    cultureData: "/v1/culture/getCulture",
    foodData: "/v1/food/getFood",
    storyData: "/v1/blogs/getBlogs"
};
export const Environment = {
    local: 'http://localhost:4200',
    production: 'https://udupi-darshan-be.onrender.com',
    routes: ApiRoutes
}
export const ROUTES = {
    HOME: { path: 'home', title: 'Udupi Darshan - Explore Culture & Nature', metaDescription: 'Discover the best places in Udupi, including culture, food, nature, and stories.' },
    NATURE: { path: 'nature', title: 'Nature in Udupi - Explore Scenic Beauty', metaDescription: 'Experience the natural beauty of Udupi with beaches, forests, and more.' },
    CULTURE: { path: 'culture', title: 'Culture of Udupi - Traditions & Heritage', metaDescription: 'Dive into the rich cultural heritage of Udupi, including traditions, temples, and history.' },
    FOOD: { path: 'food', title: 'Udupi Food - Famous Dishes & Cuisine', metaDescription: 'Taste the delicious Udupi cuisine with authentic South Indian flavors and iconic dishes.' },
    ADVERTISEMENTS: { path: 'advertisements' },
    ADMIN: { path: 'admin' },
    LANDING: { path: '', component: 'LandingPageComponent' },
    DETAILS: { path: 'details/:category/:id' },
    NOT_FOUND: { path: '404', title: 'Page Not Found - Udupi Darshan', metaDescription: 'Oops! The page you are looking for does not exist. Explore Udupi Darshan for more content.' },
    FORGOT_PASSWORD: { path: 'forgotpassword' },
    ADMIN_DASHBOARD: { path: 'admindashboard' },
    BLOG_DETAILS: { path: 'blog/:id' },
    STORY_DETAILS: { path: 'story/:id' },
    STORY: { path: 'story' },
    WILDCARD: { path: '**', redirectTo: '404', pathMatch: 'full' as 'full' }
};
export const CATEGORIES = [
    "nature-park",
    "nature-waterfalls",
    "nature-bridge",
    "nature-activity",
    "nature-island",
    "nature-camp",
    "nature-viewpoint",
    "culture-temple",
    "food-hotel",
    "food-restaurant",
    "food-cafe"
];
export const PLACEHOLDER_MAP: { [key: string]: string } = {
    "nature-park": "e.g. puttige",
    "nature-waterfalls": "e.g. arbi-falls",
    "nature-bridge": "e.g. hanging-bridge",
    "nature-activity": "e.g. hiking-spot",
    "nature-island": "e.g. st-marys",
    "nature-camp": "e.g. jungle-camp",
    "nature-viewpoint": "e.g. sunset-point",
    "culture-temple": "e.g. anantheshwara",
    "food-hotel": "e.g. woodlands",
    "food-restaurant": "e.g. fishland",
    "food-cafe": "e.g. cafe-coffee-day"
};
export const BASE_URLS: { [key: string]: string } = {
    'nature': 'https://udupi-darshan.web.app/#/nature/',
    'culture': 'https://udupi-darshan.web.app/#/culture/',
    'food': 'https://udupi-darshan.web.app/#/food/'
};
