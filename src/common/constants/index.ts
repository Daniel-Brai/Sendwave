export const ENTITY_FOUND = 'Entity was found';
export const NO_ENTITY_FOUND = 'No entity was found';

export const PARAMETERS_FAILED_VALIDATION = 'Parameters failed validation';

export const ENTITY_CREATED = 'Entity was created';
export const ENTITY_ACCEPTED = 'Entity was accepted';
export const INTERNAL_SERVER_ERROR = 'Internal server error occurred';
export const ENTITY_MODIFIED = 'Entity was modified';
export const ENTITY_DELETED = 'Entity was deleted';

export const RESULTS_RETURNED = 'Results were returned';
export const USER_NOT_FOUND =
  'Unable to get user from User Entity based on userAuthId';
export const JKWS_RATE_LIMIT = true;
export const JKWS_CACHE = true;
export const JKWS_REQUESTS_PER_MINUTE = 10;
export const BAD_REQUEST = 'Bad Request';
export const UNAUTHORIZED_REQUEST = 'User unauthorized';

export const INVALID_AUTH_PROVIDER = 'Not Supported Auth provider';
export const INVALID_BEARER_TOKEN =
  'Invalid Authorization token - Token does not match Bearer .*';
export const INVALID_AUTH_TOKEN = 'Invalid Auth Token';
export const INVALID_AUTH_TOKEN_SOURCE =
  'Invalid Auth Token or invalid source of this token, unable to fetch SigningKey for token';

export enum ALLOWED_MIMETYPES {
  'JPG' = 'image/jpg',
  'JPEG' = 'image/jpeg',
  'PNG' = 'image/png',
  'TEXT' = 'text/plain',
  'PDF' = 'application/pdf',
  'DOCX' = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}
