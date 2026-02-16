export type CallbackError = Error | { msg: string } | string;

interface BaseArgs {
  access_token?: string;
  responseType?: string;
}

export interface PushSubscriptionRoutes {
  list(): Promise<ListPushSubscriptionResponse[]>;
  create(args: CreatePushSubscriptionRouteArgs): Promise<CreatePushSubscriptionResponse>;
  delete(args: DeletePushSubscriptionRouteArgs): Promise<void>;
}

export interface ListPushSubscriptionResponse {
  id: number;
  resource_state: number;
  application_id: number;
  callback_url: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePushSubscriptionResponse {
  id: number;
}

export interface CreatePushSubscriptionRouteArgs {
  callback_url: string;
  verify_token: string;
}

export interface DeletePushSubscriptionRouteArgs {
  id: string | number;
}

export interface UploadsRoutes {
  post(args: UploadRouteArgs): Promise<Upload>;
}

export interface UploadRouteArgs {
  /** Path to file (string) or Buffer. Passed to createReadStream. */
  file: string;
  data_type: string;
  name?: string;
  description?: string;
  trainer?: 0 | 1;
  commute?: 0 | 1;
  sport_type?: string;
  activity_type?: string;
  external_id?: string;
  access_token?: string;
  maxStatusChecks?: number;
  statusCallback?: (error: CallbackError | null, response?: Upload) => void;
}

export interface Upload {
  id: string;
  id_str?: string;
  external_id?: string;
  error?: string;
  status?: string;
  activity_id?: string;
}

export interface SegmentDetailArgs extends BaseArgs {
  id: string;
}

export interface SegmentListStarredArgs extends BaseArgs {
  page?: number;
  per_page?: number;
}

export interface SegmentStarArgs extends BaseArgs {
  id: string;
  starred: boolean;
}

export interface SegmentEffortsArgs extends BaseArgs {
  id: string;
  page?: number;
  per_page?: number;
  athlete_id?: string;
  start_date_local?: string;
  end_date_local?: string;
  context_entries?: number;
}

export interface SegmentExploreArgs extends BaseArgs {
  bounds: string;
  activity_type?: string;
  min_cat?: number;
  max_cat?: number;
}

export interface SummaryPRSegmentEffort {
  pr_activity_id: number;
  pr_elapsed_time: number;
  pr_date: string;
  effort_count: number;
}

export interface SummarySegmentEffort {
  id: number;
  activity_id: number;
  elapsed_time: number;
  start_date: string;
  start_date_local: string;
  distance: number;
  is_kom: boolean;
}

export interface PolylineMap {
  id: string;
  polyline: string;
  summary_polyline: string;
}

export type LatLng = [number, number];

export interface DetailedSegment {
  id: number;
  name: string;
  activity_type: string;
  distance: number;
  average_grade: number;
  maximum_grade: number;
  elevation_high: number;
  elevation_low: number;
  start_latlng: LatLng;
  end_latlng: LatLng;
  climb_category: number;
  city: string;
  state: string;
  country: string;
  private: boolean;
  athlete_pr_effort?: SummaryPRSegmentEffort;
  athlete_segment_stats?: SummarySegmentEffort;
  created_at: string;
  updated_at: string;
  total_elevation_gain: number;
  map: PolylineMap;
  effort_count: number;
  athlete_count: number;
  hazardous: boolean;
  star_count: number;
}

export interface SummarySegment {
  id: number;
  name: string;
  activity_type: string;
  distance: number;
  average_grade?: number;
  maximum_grade?: number;
  elevation_high?: number;
  elevation_low?: number;
  start_latlng?: LatLng;
  end_latlng?: LatLng;
  climb_category?: number;
  city?: string;
  state?: string;
  country?: string;
  private?: boolean;
  athlete_pr_effort?: SummaryPRSegmentEffort;
  athlete_segment_stats?: SummarySegmentEffort;
}

export interface DetailedSegmentEffort {
  id: number;
  resource_state: number;
  name: string;
  activity?: { id: number; resource_state?: number };
  athlete?: { id: number; resource_state?: number };
  elapsed_time: number;
  moving_time?: number;
  start_date?: string;
  start_date_local?: string;
  distance?: number;
  start_index?: number;
  end_index?: number;
  average_cadence?: number;
  device_watts?: boolean;
  average_watts?: number;
  segment?: SummarySegment;
  kom_rank?: number | null;
  pr_rank?: number | null;
  achievements?: unknown[];
  hidden?: boolean;
  athlete_segment_stats?: SummaryPRSegmentEffort;
}

export interface ExplorerSegment {
  id: number;
  name: string;
  climb_category: number;
  climb_category_desc: string;
  avg_grade: number;
  start_latlng: LatLng;
  end_latlng: LatLng;
  elev_difference: number;
  distance: number;
  points: string;
}

export interface DetailedGear {
  id: string;
  resource_state: number;
  primary: boolean;
  name: string;
  distance: number;
  brand_name: string;
  model_name: string;
  frame_type?: number;
  description: string;
}

export interface ActivityTotal {
  count: number;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  elevation_gain: number;
  achievement_count: number;
}

export interface ActivityStats {
  biggest_ride_distance: number;
  biggest_climb_elevation_gain: number;
  recent_ride_totals: ActivityTotal;
  recent_run_totals: ActivityTotal;
  recent_swim_totals: ActivityTotal;
  ytd_ride_totals: ActivityTotal;
  ytd_run_totals: ActivityTotal;
  ytd_swim_totals: ActivityTotal;
  all_ride_totals: ActivityTotal;
  all_run_totals: ActivityTotal;
  all_swim_totals: ActivityTotal;
}

export interface SegmentsRoutes {
  get(args: SegmentDetailArgs): Promise<DetailedSegment>;
  listStarred(args?: SegmentListStarredArgs): Promise<SummarySegment[]>;
  starSegment(args: SegmentStarArgs): Promise<DetailedSegment>;
  listEfforts(args: SegmentEffortsArgs): Promise<DetailedSegmentEffort[]>;
  explore(args: SegmentExploreArgs): Promise<ExplorerSegment[]>;
}

export interface SegmentEffortsRoutes {
  get(args: DetailRoute): Promise<DetailedSegmentEffort>;
}

export interface TimeStream {
  type: "time";
  original_size: number;
  resolution: "low" | "medium" | "high";
  series_type: "distance" | "time";
  data: number[];
}

export interface DistanceStream {
  type: "distance";
  original_size: number;
  resolution: "low" | "medium" | "high";
  series_type: "distance" | "time";
  data: number[];
}

export interface LatLngStream {
  type: "latlng";
  original_size: number;
  resolution: "low" | "medium" | "high";
  series_type: "distance" | "time";
  data: LatLng[];
}

export interface AltitudeStream {
  type: "altitude";
  original_size: number;
  resolution: "low" | "medium" | "high";
  series_type: "distance" | "time";
  data: number[];
}

export interface SmoothVelocityStream {
  type: "velocity_smooth";
  original_size: number;
  resolution: "low" | "medium" | "high";
  series_type: "distance" | "time";
  data: number[];
}

export interface HeartrateStream {
  type: "heartrate";
  original_size: number;
  resolution: "low" | "medium" | "high";
  series_type: "distance" | "time";
  data: number[];
}

export interface CadenceStream {
  type: "cadence";
  original_size: number;
  resolution: "low" | "medium" | "high";
  series_type: "distance" | "time";
  data: number[];
}

export interface PowerStream {
  type: "watts";
  original_size: number;
  resolution: "low" | "medium" | "high";
  series_type: "distance" | "time";
  data: number[];
}

export interface TemperatureStream {
  type: "temp";
  original_size: number;
  resolution: "low" | "medium" | "high";
  series_type: "distance" | "time";
  data: number[];
}

export interface MovingStream {
  type: "moving";
  original_size: number;
  resolution: "low" | "medium" | "high";
  series_type: "distance" | "time";
  data: boolean[];
}

export interface SmoothGradeStream {
  type: "grade_smooth";
  original_size: number;
  resolution: "low" | "medium" | "high";
  series_type: "distance" | "time";
  data: number[];
}

export type StreamSet =
  | TimeStream
  | DistanceStream
  | LatLngStream
  | AltitudeStream
  | SmoothVelocityStream
  | HeartrateStream
  | CadenceStream
  | PowerStream
  | TemperatureStream
  | MovingStream
  | SmoothGradeStream;

/** Args for stream endpoints (id required; optional keys, key_by_type, etc.). */
export interface StreamsArgs extends DetailRoute {
  keys?: string[];
  key_by_type?: boolean;
  original_size?: boolean;
  resolution?: string;
  series_type?: string;
}

export interface StreamsRoutes {
  activity(args: StreamsArgs): Promise<StreamSet[]>;
  route(args: StreamsArgs): Promise<StreamSet[]>;
  effort(args: StreamsArgs): Promise<StreamSet[]>;
  segment(args: StreamsArgs): Promise<StreamSet[]>;
}

export interface RouteRoutes {
  get(args: DetailRoute): Promise<Route>;
  getFile(args: RouteFile): Promise<string>;
}

export interface DetailRoute extends BaseArgs {
  id: string;
}

export interface RouteFile extends BaseArgs {
  id: string;
  file_type: string;
}

export interface GearRoutes {
  get(args: DetailRoute): Promise<DetailedGear>;
}

export interface DetailedClub {
  id: number;
  resource_state: number;
  name: string;
  profile_medium: string;
  cover_photo: string;
  cover_photo_small: string;
  sport_type: SportType;
  city: string;
  state: string;
  country: string;
  private: boolean;
  member_count: number;
  featured: boolean;
  verified: boolean;
  url: string;
  membership: string;
  admin: boolean;
  owner: boolean;
  following_count: number;
}

export interface SummaryAthlete {
  id: number;
  resource_state: number;
  firstname: string;
  lastname: string;
  profile_medium: string;
  profile: string;
  city: string;
  state: string;
  country: string;
  sex: "M" | "F";
  premium: boolean;
  summit: boolean;
  created_at: string;
  updated_at: string;
}

export interface DetailedAthlete extends SummaryAthlete {
  follower_count: number;
  friend_count: number;
  measurement_preference: "feet" | "meters";
  ftp?: number;
  weight?: number;
  clubs: SummaryClub[];
  bikes: SummaryGear[];
  shoes: SummaryGear[];
}

export interface ClubsRoutes {
  get(args: ClubsRoutesArgs): Promise<DetailedClub>;
  listMembers(args: ClubsRoutesListArgs): Promise<SummaryAthlete[]>;
  listActivities(args: ClubsRoutesListArgs): Promise<ClubActivity[]>;
  listAdmins(args: ClubsRoutesListArgs): Promise<SummaryAthlete[]>;
}

export interface ClubsRoutesArgs extends BaseArgs {
  id: string;
}

export interface ClubsRoutesListArgs extends ClubsRoutesArgs {
  page?: number;
  per_page?: number;
}

export interface ClubActivity {
  athlete: MetaAthlete;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: ActivityType;
  sport_type: SportType;
  workout_type: number;
}

export interface AthletesRoutes {
  stats(args: AthleteRouteArgs): Promise<ActivityStats>;
}

export interface AthleteRouteArgs extends BaseArgs {
  id: string;
  page?: number;
  offset?: number;
}

export interface Route {
  athlete: SummaryAthlete;
  description: string;
  distance: number;
  elevation_gain: number;
  id: string;
  id_str: string;
  map: PolylineMap;
  name: string;
  private: boolean;
  starred: boolean;
  timestamp: number;
  type: number;
  sub_type: number;
  created_at: string;
  updated_at: string;
  estimated_moving_time: number;
  segments: SummarySegment[];
  waypoints: Waypoint[];
}

export interface Waypoint {
  latlng: LatLng;
  target_latlng?: LatLng;
  categories: string[];
  title: string;
  description?: string;
  distance_into_route: number;
}

export type SportType =
  | "AlpineSki"
  | "BackcountrySki"
  | "Badminton"
  | "Canoeing"
  | "Crossfit"
  | "EBikeRide"
  | "Elliptical"
  | "EMountainBikeRide"
  | "Golf"
  | "GravelRide"
  | "Handcycle"
  | "HighIntensityIntervalTraining"
  | "Hike"
  | "IceSkate"
  | "InlineSkate"
  | "Kayaking"
  | "Kitesurf"
  | "MountainBikeRide"
  | "NordicSki"
  | "Pickleball"
  | "Pilates"
  | "Racquetball"
  | "Ride"
  | "RockClimbing"
  | "RollerSki"
  | "Rowing"
  | "Run"
  | "Sail"
  | "Skateboard"
  | "Snowboard"
  | "Snowshoe"
  | "Soccer"
  | "Squash"
  | "StairStepper"
  | "StandUpPaddling"
  | "Surfing"
  | "Swim"
  | "TableTennis"
  | "Tennis"
  | "TrailRun"
  | "Velomobile"
  | "VirtualRide"
  | "VirtualRow"
  | "VirtualRun"
  | "Walk"
  | "WeightTraining"
  | "Wheelchair"
  | "Windsurf"
  | "Workout"
  | "Yoga";

export interface MetaAthlete {
  id: number;
}

export interface MetaActivity {
  id: number;
}

export interface PhotosSummary {
  count: number;
  primary: PhotosSummary_primary;
}

export interface PhotosSummary_primary {
  id: number;
  source: number;
  unique_id: string;
  urls: Record<string, string>;
}

export interface SummaryGear {
  id: string;
  resource_state: number;
  primary: boolean;
  name: string;
  distance: number;
}

export interface Split {
  average_speed: number;
  distance: number;
  elapsed_time: number;
  elevation_difference: number;
  pace_zone: number;
  moving_time: number;
  split: number;
}

export interface Lap {
  id: number;
  activity: MetaActivity;
  athlete: MetaAthlete;
  average_cadence: number;
  average_speed: number;
  distance: number;
  elapsed_time: number;
  start_index: number;
  end_index: number;
  lap_index: number;
  max_speed: number;
  moving_time: number;
  name: string;
  pace_zone: number;
  split: number;
  start_date: string;
  start_date_local: string;
  total_elevation_gain: number;
}

export type ActivityType = 
  | "AlpineSki" 
  | "BackcountrySki" 
  | "Canoeing" 
  | "Crossfit" 
  | "EBikeRide" 
  | "Elliptical" 
  | "Golf" 
  | "Handcycle" 
  | "Hike" 
  | "IceSkate" 
  | "InlineSkate" 
  | "Kayaking" 
  | "Kitesurf" 
  | "NordicSki" 
  | "Ride" 
  | "RockClimbing" 
  | "RollerSki" 
  | "Rowing" 
  | "Run" 
  | "Sail" 
  | "Skateboard" 
  | "Snowboard" 
  | "Snowshoe" 
  | "Soccer" 
  | "StairStepper" 
  | "StandUpPaddling" 
  | "Surfing" 
  | "Swim" 
  | "Velomobile" 
  | "VirtualRide" 
  | "VirtualRun" 
  | "Walk" 
  | "WeightTraining" 
  | "Wheelchair" 
  | "Windsurf" 
  | "Workout" 
  | "Yoga";

export interface DetailedActivity extends SummaryActivity {
  description?: string;
  photos: PhotosSummary;
  gear?: SummaryGear | null;
  calories?: number;
  segment_efforts: DetailedSegmentEffort[];
  embed_token?: string;
  splits_metric: Split[];
  splits_standard: Split[];
  laps: Lap[];
  best_efforts: DetailedSegmentEffort[];
}

export interface ActivityCreateArgs extends BaseArgs {
  name: string;
  type?: ActivityType;
  sport_type: SportType;
  start_date_local: string;
  elapsed_time: number;
  description?: string;
  distance?: number;
  trainer?: number;
  commute?: number;
  private?: boolean;
}

export interface ActivityUpdateArgs extends BaseArgs {
  id: string;
  commute?: boolean;
  trainer?: boolean;
  hide_from_home?: boolean;
  description?: string;
  name?: string;
  type?: ActivityType;
  sport_type?: SportType;
  gear_id?: string;
}

export interface TimedZoneRange {
  min: number;
  max: number;
  time: number;
}

export interface ActivityZone {
  score: number;
  distribution_buckets: TimedZoneRange[];
  type: "heartrate" | "power";
  sensor_based: boolean;
  points: number;
  custom_zones: boolean;
  max: number;
}

export interface Comment {
  id: number;
  activity_id: number;
  text: string;
  athlete: SummaryAthlete;
  created_at: string;
  cursor?: string;
}

/** Args for listing activity comments (cursor-based pagination). */
export interface ActivityCommentsArgs extends DetailRoute {
  /** Number of items per page. Defaults to 30. */
  page_size?: number;
  /** Cursor from the last item of the previous page. Omit for the first page. */
  after_cursor?: string;
}

/** Args for listing activity kudoers (cursor-based pagination). */
export interface ActivityKudoersArgs extends DetailRoute {
  /** Number of items per page. Defaults to 30. */
  page_size?: number;
  /** Cursor from the last item of the previous page. Omit for the first page. */
  after_cursor?: string;
}

export interface ActivitiesRoutes {
  get(args: DetailRoute): Promise<DetailedActivity>;
  create(args: ActivityCreateArgs): Promise<DetailedActivity>;
  update(args: ActivityUpdateArgs): Promise<DetailedActivity>;
  listZones(args: DetailRoute): Promise<ActivityZone[]>;
  listLaps(args: DetailRoute): Promise<Lap[]>;
  listComments(args: ActivityCommentsArgs): Promise<Comment[]>;
  listKudoers(args: ActivityKudoersArgs): Promise<SummaryAthlete[]>;
}

export interface AthleteUpdateArgs extends BaseArgs {
  weight?: number;
  ftp?: number;
}

export interface AthleteListArgs extends BaseArgs {
  page?: number;
  per_page?: number;
  before?: number;
  after?: number;
}

export interface SummaryClub {
  id: number;
  resource_state: number;
  name: string;
  profile_medium: string;
  profile: string;
  cover_photo: string;
  cover_photo_small: string;
  sport_type: "cycling" | "running" | "triathlon" | "other";
  activity_types: ActivityType[];
  city: string;
  state: string;
  country: string;
  private: boolean;
  member_count: number;
  featured: boolean;
  verified: boolean;
  url: string;
}

export interface SummaryActivity {
  id: number;
  external_id?: string | null;
  upload_id?: number | null;
  athlete: MetaAthlete;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  elev_high: number;
  elev_low: number;
  type: ActivityType;
  sport_type: SportType;
  start_date: string;
  start_date_local: string;
  timezone: string;
  start_latlng: LatLng | null;
  end_latlng: LatLng | null;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  total_photo_count: number;
  map: PolylineMap | null;
  device_name: string;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  flagged: boolean;
  workout_type?: number;
  upload_id_str: string;
  average_speed: number;
  max_speed: number;
  has_kudoed: boolean;
  hide_from_home: boolean;
  gear_id?: string | null;
  kilojoules?: number;
  average_watts?: number;
  device_watts?: boolean;
  max_watts?: number;
  weighted_average_watts?: number;
  resource_state: number;
}

export interface AthleteRoutes {
  get(args?: BaseArgs): Promise<DetailedAthlete>;
  update(args: AthleteUpdateArgs): Promise<DetailedAthlete>;
  listActivities(
    args?: AthleteListArgs
  ): Promise<SummaryActivity[]>;
  listRoutes(args?: AthleteListArgs): Promise<Route[]>;
  listClubs(args?: AthleteListArgs): Promise<SummaryClub[]>;
  listZones(args?: AthleteListArgs): Promise<ActivityZone[]>;
}

export interface GetRequestAccessURLArgs {
  scope?: string;
  state?: string;
  approval_prompt?: "prompt" | "auto";
}

/** Minimal response from the deauthorize endpoint (success or error). */
export interface DeauthorizeResponse {
  /** Access token that was revoked (present on success). */
  access_token?: string;
  /** Error message (e.g. present on 401). */
  message?: string;
}

export interface OAuthRoutes {
  getRequestAccessURL(args?: GetRequestAccessURLArgs): string;
  getToken(authorizationCode: string): Promise<RefreshTokenResponse>;
  refreshToken(refreshToken: string): Promise<RefreshTokenResponse>;
  deauthorize(args: { access_token: string }): Promise<DeauthorizeResponse>;
}

export interface RefreshTokenResponse {
  token_type: string;
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  athlete?: SummaryAthlete;
  state?: string;
}

export interface ParsedRateLimits {
  shortTermUsage: number;
  shortTermLimit: number;
  longTermUsage: number;
  longTermLimit: number;
  readShortTermUsage: number;
  readShortTermLimit: number;
  readLongTermUsage: number;
  readLongTermLimit: number;
}

export interface RateLimiting {
  exceeded(): boolean;
  fractionReached(): number;
  readExceeded(): boolean;
  readFractionReached(): number;
  parseRateLimits(headers: Record<string, string | string[] | undefined>): ParsedRateLimits | null;
  updateRateLimits(headers: Record<string, string | string[] | undefined>): ParsedRateLimits | null;
  clear(): void;
}

export interface AuthenticationConfig {
  access_token?: string;
  client_id?: string;
  client_secret?: string;
  redirect_uri?: string;
}

export interface RequestOptions {
  url: string;
  method?: string;
  body?: unknown;
  headers?: Record<string, string | null | undefined>;
  baseUrl?: string;
  responseType?: string;
  resolveWithFullResponse?: boolean;
  simple?: boolean;
  form?: Record<string, unknown>;
  multipart?: unknown;
}

export interface FullResponse {
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export type RequestHandler = (
  options: RequestOptions
) => Promise<FullResponse | string | object>;

/** Instance returned by `new strava.client(token, request)`. */
export interface StravaClientInstance {
  access_token: string;
  athlete: AthleteRoutes;
  athletes: AthletesRoutes;
  activities: ActivitiesRoutes;
  clubs: ClubsRoutes;
  gear: GearRoutes;
  segments: SegmentsRoutes;
  segmentEfforts: SegmentEffortsRoutes;
  streams: StreamsRoutes;
  uploads: UploadsRoutes;
  rateLimiting: RateLimiting;
  routes: RouteRoutes;
}

export interface Strava {
  config(config: AuthenticationConfig): void;
  client: new (token: string, request?: RequestHandler) => StravaClientInstance;
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
  routes: RouteRoutes;
  oauth: OAuthRoutes;
}

declare const strava: Strava;
export default strava;
