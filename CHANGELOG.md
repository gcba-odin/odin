# Version 0.1.0 Beta (12/08/2016)


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