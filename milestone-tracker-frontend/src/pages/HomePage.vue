<template>
  <section class="section">
    <div class="content columns is-multiline">
      <div class="column is-7">
        <h1 class="is-size-1" v-html="$t('pages.home.title')"></h1>
      </div>
      <div class="column is-12 mb-4" v-html="$t('pages.home.content')"></div>
      <div class="column is-7">
        <h1 class="is-size-2 mb-0">{{ $t('pages.home.how') }}</h1>
      </div>
      <div class="column is-12 mb-4" v-html="$t('pages.home.how_content')">
      </div>
      <div class="column is-7">
        <h1 class="is-size-2 mb-0">{{ $t('pages.home.faq') }}</h1>
      </div>
      <div class="column is-12 mb-6" v-html="$t('pages.home.faq_content')">
      </div>
    </div>
  </section>
</template>
