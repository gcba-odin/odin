/*
 * index
 *
 */

//==============================================================================

var nodepath = require("path");

require(nodepath.join(__dirname, "lib", "global"));
require(nodepath.join(__dirname, "lib", "before"));

//-- try to load local bootstrap
try {
  requireHelper("bootstrap");
} catch (e) {
  if (!(e.code === "MODULE_NOT_FOUND" && /bootstrap/.test(e.message))) {
    throw e;
  }
}

require(nodepath.join(__dirname, "lib", "after"));

//==============================================================================
