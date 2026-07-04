/*
|--------------------------------------------------------------------------
| Edge globals
|--------------------------------------------------------------------------
|
| Custom helpers made available to all Edge templates.
|
*/

import edge from 'edge.js'
import appUrl from '#helpers/app_url'

edge.global('appUrl', appUrl)
