import Level1Model from "./Level1Model.js";

import Level1View from "./Level1View.js";

import Level1Controller from "./Level1Controller.js";

const model = new Level1Model();

const view = new Level1View();

new Level1Controller(model, view);
