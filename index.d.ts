type Callback = (error: any, payload: any) => void;

interface BaseArgs {
  access_token?: string;
}

interface ApplicationBaseArgs {
  client_id: string;
  client_secret: string;
}

export interface PushSubscriptionRoutes {
  list(done?: Callback): Promise<ListPushSubscriptionResponse[]>;
  create(
    args: CreatePushSubscriptionRouteArgs,
    done?: Callback
  ): Promise<CreatePushSubscriptionResponse>;
  delete(args: DeletePushSubscriptionRouteArgs, done?: Callback): Promise<void>;
}

export interface ListPushSubscriptionResponse {
  id: number;
  resource_state: number;
  application_id: number;
  callback_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePushSubscriptionResponse {
  id: number;
}

export interface CreatePushSubscriptionRouteArgs extends ApplicationBaseArgs {
  callback_url: string;
  verify_token: string;
}

export interface DeletePushSubscriptionRouteArgs extends ApplicationBaseArgs {
  id: string;
}

export interface UploadsRoutes {
  post(args: UploadRouteArgs, done?: Callback): Promise<UploadResponse>;
}

export interface UploadRouteArgs {
  file: Buffer;
  name: string;
  description?: string;
  trainer?: string;
  commute?: string;
  data_type: string;
  external_id: string;
}

export interface UploadResponse {
  id: string;
  id_str?: string;
  external_id?: string;
  error?: string;
  status?: string;
  activity_id?: string;
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
  getFile(args: RouteFile, done?: Callback): Promise<any>;
}

export interface DetailRoute extends BaseArgs {
  id: string;
}

export interface RouteFile extends BaseArgs {
  id: string;
  file_type: string;
}

export interface GearRoutes {
  get(args: any, done?: Callback): Promise<any>;
}

export interface RunningRacesRoutes {
  get(args: any, done?: Callback): Promise<any>;
  listRaces(args: any, done?: Callback): Promise<any>;
}

export interface ClubsRoutes {
  get(args: ClubsRoutesArgs, done?: Callback): Promise<any>;
  listMembers(args: ClubsRoutesListArgs, done?: Callback): Promise<any>;
  listActivities(
    args: ClubsRoutesListArgs,
    done?: Callback
  ): Promise<ClubActivity[]>;
  listAnnouncements(args: ClubsRoutesListArgs, done?: Callback): Promise<any>;
  listEvents(args: ClubsRoutesListArgs, done?: Callback): Promise<any>;
  listAdmins(args: ClubsRoutesListArgs, done?: Callback): Promise<any>;
  joinClub(args: ClubsRoutesListArgs, done?: Callback): Promise<any>;
  leaveClub(args: ClubsRoutesListArgs, done?: Callback): Promise<any>;
}

export interface ClubsRoutesArgs extends BaseArgs {
  id: string;
}

export interface ClubsRoutesListArgs extends ClubsRoutesArgs {
  page?: number;
  per_page?: number;
}

export interface ClubActivity {
  resource_state: number;
  athlete: {
    resource_state: number;
    firstname: string;
    lastname: string;
  };
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  workout_type?: number | null;
}

export interface AthletesRoutes {
  get(args: AthleteRouteArgs, done?: Callback): Promise<AthleteRouteResponse>;
  stats(args: any, done?: Callback): Promise<any>;
}

export interface AthleteRouteArgs extends BaseArgs {
  athlete_id: string;
  page?: number;
  offset?: number;
}

export interface AthleteRouteResponse {
  athlete: AthleteResponse;
  description?: string;
  distance?: number;
  elevation_gain?: number;
  id: string;
  id_str?: string;
  map?: PolylineMapResponse;
  name?: string;
  private: boolean;
  starred?: boolean;
  timestamp?: number;
  type?: number;
  sub_type?: number;
  created_at: Date;
  updated_at: Date;
  estimated_moving_time?: number;
  segments?: any[];
}

export interface AthleteResponse {
  id: string;
  resource_state?: number;
  firstname?: string;
  lastname?: string;
  profile_medium?: string;
  profile?: string;
  city?: string;
  state?: string;
  country?: string;
  sex?: string;
  premium?: boolean;
  summit?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PolylineMapResponse {
  id: string;
  polyline: string;
  summary_polyline: string;
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
  refreshToken(code: string): Promise<RefreshTokenResponse>;
  deauthorize(args: any, done?: Callback): Promise<any>;
}

export interface RefreshTokenResponse {
  token_type: string;
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
}

export interface RateLimiting {
  exceeded(): boolean;
  fractionReached(): number;
}

export interface AuthenticationConfig {
  access_token: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
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

declare const strava: Strava;
export default strava;
