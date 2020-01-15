
type Callback = (error: any, payload: any) => void;

export interface PushSubscriptionRoutes {
    list(args: any, done?: Callback): Promise<any>;
    create(args: any, done?: Callback): Promise<any>;
    delete(args: any, done?: Callback): Promise<any>;
}

export interface UploadsRoutes {
    post(args: any, done?: Callback): Promise<any>;
}

export interface SegmentsRoutes {
    get(args: any, done?: Callback): Promise<any>;
    listStarred(args: any, done?: Callback): Promise<any>;
    listEfforts(args: any, done?: Callback): Promise<any>;
    listLeaderboard(args: any, done?: Callback): Promise<any>;
    explore(args: any, done?: Callback): Promise<any>;
}

export interface SegmentEffortsRoutes {
    get(args: any, done?: Callback): Promise<any>;
}

export interface StreamsRoutes {
    activity(args: any, done?: Callback): Promise<any>;
    effort(args: any, done?: Callback): Promise<any>;
    segment(args: any, done?: Callback): Promise<any>;
}

export interface RoutesRoutes {
    get(args: any, done?: Callback): Promise<any>;
}

export interface GearRoutes {
    get(args: any, done?: Callback): Promise<any>;
}

export interface RunningRacesRoutes {
    get(args: any, done?: Callback): Promise<any>;
    listRaces(args: any, done?: Callback): Promise<any>;
}

export interface ClubsRoutes {
    get(args: any, done?: Callback): Promise<any>;
    listMembers(args: any, done?: Callback): Promise<any>;
    listActivities(args: any, done?: Callback): Promise<any>;
    listAnnouncements(args: any, done?: Callback): Promise<any>;
    listEvents(args: any, done?: Callback): Promise<any>;
    listAdmins(args: any, done?: Callback): Promise<any>;
    joinClub(args: any, done?: Callback): Promise<any>;
    leaveClub(args: any, done?: Callback): Promise<any>;
}

export interface AthletesRoutes {
    get(args: any, done?: Callback): Promise<any>;
    stats(args: any, done?: Callback): Promise<any>;
}

export interface ActivitiesRoutes {
    get(args: any, done?: Callback): Promise<any>;
    create(args: any, done?: Callback): Promise<any>;
    update(args: any, done?: Callback): Promise<any>;
    listFriends(args: any, done?: Callback): Promise<any>;
    listZones(args: any, done?: Callback): Promise<any>;
    listLaps(args: any, done?: Callback): Promise<any>;
    listComments(args: any, done?: Callback): Promise<any>;
    listKudos(args: any, done?: Callback): Promise<any>;
    listPhotos(args: any, done?: Callback): Promise<any>;
    listRelated(args: any, done?: Callback): Promise<any>;
}

export interface AthleteRoutes {
    get(args: any, done?: Callback): Promise<any>;
    update(args: any, done?: Callback): Promise<any>;
    listActivities(args: any, done?: Callback): Promise<any>;
    listRoutes(args: any, done?: Callback): Promise<any>;
    listClubs(args: any, done?: Callback): Promise<any>;
    listZones(args: any, done?: Callback): Promise<any>;
}

export interface OAuthRoutes {
    getRequestAccessURL(args: any): Promise<any>;
    getToken(code: string, done?: Callback): Promise<any>;
    refreshToken(code: string): Promise<any>;
    deauthorize(args: any, done?: Callback): Promise<any>;
}

export interface RateLimiting {
    exceeded(): boolean;
    fractionReached(): boolean;
}

export interface AuthenticationConfig {
    access_token: string,
    client_id: string,
    client_secret: string,
    redirect_uri: string
}

export interface Strava {
    config(config: AuthenticationConfig): void;
    client(token: string): void;
    athlete: AthleteRoutes;
    athletes: AthletesRoutes;
    activities: ActivitiesRoutes;
    clubs: ClubsRoutes;
    gear: GearRoutes;
    segments: SegmentsRoutes;
    segmentEfforts: SegmentEffortsRoutes;
    pushSubscriptions: PushSubscriptionRoutes;
    streams: StreamsRoutes;
    uploads: UploadsRoutes;
    rateLimiting: RateLimiting;
    runningRaces: RunningRacesRoutes;
    routes: RoutesRoutes;
    oauth: OAuthRoutes;
}

export const strava: Strava;

export default strava;