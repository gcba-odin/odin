# Version 0.2.0 Beta (09/09/2016)

## New features

- **Responses** - Refresh token endpoint
- **Responses** - Implemented publish/unpublish endpoint
- **Responses** - Refresh token endpoint
- **Maps** - Information on how many points were created correctly/incorrectly

## Fixes

- **Maps** - Fix map creation from link
- **Maps** - Fix lat/long fields with points
- **Charts** - Quiantitative charts aggregates columns
- **Tests** - Updates and fix on mocha tests
- **Files** - Fix xls/xlsx with '.' on headers
- **Files** - Fix file download
- **Files** - Fix delete file
- **Files** - Delete old file when is updated
- **Datasets** - Slugified datasets names
- **Responses** - Fix Bad Request response, data now returned on `data`
- **Authorization** - Policy `is authenticated` now asks for x-admin-authorization header

# Version 0.1.1 Alpha (12/08/2016)


## New features

- Added Maps support
- Added Charts support
- Implemented partial responses
- Implemented conditional filters
- Added deep queries support
- Added RSS feed support
- Created file API
- Created stats system
- Set up a logging system with [Winston](https://github.com/winstonjs/winston)

## Enhancements

- Added unit tests
- Some configs are now in the DB

## Fixes

- **Categories** - Added image endpoint `/categories/:id/image`
- **Categories** - Added `active` field
- **Files** - The creation of zip files became async
- **Files** - Improved file deletion
- **Files** - File URL wasn't being set on creation
- **Files** - Now the necessary folders get created automatically if needed
- **Files** -  Added new endpoint `/files/:id/resources`
- **Files** - Fixed file upload issues
- **Files** - Added `gatheringDate`, `updateDate` and `updated` fields
- **FileTypes** - Added `mimetype`field
- **Responses** - POST and PATCH responses weren't getting populated
- **Responses** - Some responses were missing `meta`and `links`
- **Responses** - Implemented missing response codes
- **Responses** - Improved OPTIONS method
- **Quality** - Fixed code quality issues


# Version 0.1.0 Alpha (22/06/2016)

- Created endpoints
- Added file upload support
- Added dataset download support
- Implemented related fields population
- Added search capabilities
