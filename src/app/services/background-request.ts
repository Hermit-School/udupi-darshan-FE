import { HttpContextToken } from '@angular/common/http';

export const BACKGROUND_REQUEST = new HttpContextToken(() => false);
