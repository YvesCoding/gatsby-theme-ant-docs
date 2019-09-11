import Vue from 'vue';
import { findPageForPath } from './util';

export default function dataMixin(siteData) {
  prepare(siteData);
  const store = new Vue({
    data: { siteData }
  });

  if (module.hot) {
    module.hot.accept('./.temp/siteData', () => {
      prepare(siteData);
      store.siteData = siteData;
    });
  }

  return {
    computed: {
      $site() {
        return store.siteData;
      },
      $localeConfig() {
        const { locales = {} } = this.$site;
        let targetLang;
        let defaultLang;
        for (const path in locales) {
          if (path === '/') {
            defaultLang = locales[path];
          } else if (this.$page.path.indexOf(path) === 0) {
            targetLang = locales[path];
          }
        }
        return targetLang || defaultLang || {};
      },
      $siteTitle() {
        return (
          this.$localeConfig.title || this.$site.title || ''
        );
      },
      $title() {
        const page = this.$page;
        const siteTitle = this.$siteTitle;
        const selfTitle = page.frontMatter.home
          ? null
          : page.frontMatter.title || page.title; // explicit title // inferred title
        return siteTitle
          ? selfTitle
            ? selfTitle + ' | ' + siteTitle
            : siteTitle
          : selfTitle || 'VuePress';
      },
      $description() {
        // #565 hoist description from meta
        if (this.$page.frontMatter.meta) {
          const descriptionMeta = this.$page.frontMatter.meta.filter(
            item => item.name === 'description'
          )[0];
          if (descriptionMeta)
            return descriptionMeta.content;
        }
        return (
          this.$page.frontMatter.description ||
          this.$localeConfig.description ||
          this.$site.description ||
          ''
        );
      },
      $lang() {
        return (
          this.$page.frontMatter.lang ||
          this.$localeConfig.lang ||
          'en-US'
        );
      },
      $localePath() {
        return this.$localeConfig.path || '/';
      },
      $themeLocaleConfig() {
        return (
          (this.$site.themeConfig.locales || {})[
            this.$localePath
          ] || {}
        );
      },
      $page() {
        return findPageForPath(
          this.$site.pages,
          this.$route.path
        );
      }
    }
  };
}

function prepare(siteData) {
  siteData.pages.forEach(page => {
    if (!page.frontMatter) {
      page.frontMatter = {};
    }
  });
  if (siteData.locales) {
    Object.keys(siteData.locales).forEach(path => {
      siteData.locales[path].path = path;
    });
  }
  Object.freeze(siteData);
}
