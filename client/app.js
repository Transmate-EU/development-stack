/* eslint-disable new-cap */
/* global sAlert */
import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/kadira:flow-router";
import { ReactiveDict } from "meteor/reactive-dict";
import { Template } from "meteor/templating";
import { $ } from "meteor/jquery";
import browserCheck from "ua-parser-js";

// blaze global helpers
import "/imports/utils/UI/registerHelpers";

// UI
import "./app.html";
import "./sAlert.html";
import "./demo.html";
import "../../components/header/search";
import "../../components/header/notifications";
import "../../components/header/tasks";
import "../../components/header/user";
import "../../components/header/conversations";

// used in multiple templates
import "/imports/client/components/utilities/section";
import "/imports/client/components/tabs/tabs";

import NavBar from "../../components/layout/NavBar";
import { AllAccounts } from "../../../api/allAccounts/AllAccounts";

const debug = require("debug")("app:main");

// eslint-disable-next-line func-names
Template.AppLayout.onCreated(function() {
  debug("app started");
  this.state = new ReactiveDict();
  this.state.set("asside-minimized", false);
  sAlert.config({
    html: true,
    stack: {
      spacing: 5
    },
    position: "top-right"
  });
});

// eslint-disable-next-line func-names
Template.AppLayout.onRendered(function() {
  // add semantic ui

  return $("body > .ui.sidebar").sidebar({
    transition: "overlay",
    dimPage: false
  });
});

Template.AppLayout.helpers({
  state(key) {
    return Template.instance().state.get(key);
  },
  isIE() {
    return new browserCheck().getEngine().name === "Trident";
  },
  isProduction() {
    return Meteor.isProduction;
  },
  expanded(aside) {
    if (aside) {
      return "expanded";
    }
    return "";
  },
  unixTimestamp(date) {
    return Math.round(date / 1000);
  },
  NavBar() {
    return {
      component: NavBar,
      activeRoute: FlowRouter.current().route.name,
      accountFeatures: AllAccounts.getFeatures()
    };
  }
});

Template.AppLayout.events({
  "click a.minimize": function minimizeAside(event, templateInstance) {
    event.preventDefault();
    const val = !templateInstance.state.get("asside-minimized");
    if (val) {
      // 420 is static value of the expanded class aside tag, needs to convert dynamically
      $(".ui.segment.rates").width($(".ui.segment.rates").width() + 420);
    } else {
      $(".ui.segment.rates").width($(".ui.segment.rates").width() - 420);
    }
    return templateInstance.state.set("asside-minimized", val);
  },
  'focus form[role="search"] input': function searchFocus(
    event,
    templateInstance
  ) {
    return templateInstance.state.set("searching", true);
  },
  'blur form[role="search"] input': function searchBlur(
    event,
    templateInstance
  ) {
    return templateInstance.state.set("searching", false);
  }
});
