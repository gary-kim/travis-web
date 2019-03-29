import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, or, and, not } from '@ember/object/computed';
import { computed } from '@ember/object';
import config from 'travis/config/environment';

const { billingEndpoint, githubOrgsOauthAccessSettingsUrl } = config;

export default Component.extend({
  tagName: '',

  accounts: service(),
  features: service(),

  activeModel: null,
  model: reads('activeModel'),

  user: reads('accounts.user'),
  organizations: reads('accounts.organizations'),

  accountName: or('model.name', 'model.login'),
  billingUrl: or('model.subscription.billingUrl', 'model.billingUrl'),

  showSubscriptionStatusBanner: and('checkSubscriptionStatus', 'model.subscriptionError'),
  showMigrationBetaBanner: not('features.proVersion'),

  get githubOrgsOauthAccessSettingsUrl() {
    return githubOrgsOauthAccessSettingsUrl;
  },

  checkSubscriptionStatus: computed('features.enterpriseVersion', function () {
    let enterprise = this.get('features.enterpriseVersion');
    return !enterprise && !!billingEndpoint;
  }),

});
