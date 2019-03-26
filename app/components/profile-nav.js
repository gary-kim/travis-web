import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, or, and } from '@ember/object/computed';
import { computed } from '@ember/object';
import config from 'travis/config/environment';

const { billingEndpoint, githubOrgsOauthAccessSettingsUrl } = config;

export default Component.extend({
  tagName: '',

  accounts: service(),
  features: service(),

  user: reads('accounts.user'),
  organizations: reads('accounts.organizations'),

  activeModel: null,
  model: reads('activeModel'),

  accountName: or('model.name', 'model.login'),
  billingUrl: or('model.subscription.billingUrl', 'model.billingUrl'),

  reposToMigrate: reads('model.githubAppsRepositoriesOnOrg'),

  showMigrateTab: and('features.proVersion', 'user.allowMigration'),
  showMigrateBadge: or('reposToMigrate.isNotEmpty', 'reposToMigrate.isFiltering'),
  showSubscriptionStatusBanner: and('checkSubscriptionStatus', 'model.subscriptionError'),

  get githubOrgsOauthAccessSettingsUrl() {
    return githubOrgsOauthAccessSettingsUrl;
  },

  checkSubscriptionStatus: computed('features.enterpriseVersion', function () {
    return !this.features.get('enterpriseVersion') && !!billingEndpoint;
  }),

});
