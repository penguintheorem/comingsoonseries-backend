import { Observable } from 'rxjs';
export declare class UserController {
    getUserData(urlSegmentParams: {
        userId: string;
    }): Observable<{
        id: string;
        name: string;
        surname: string;
    }>;
}
