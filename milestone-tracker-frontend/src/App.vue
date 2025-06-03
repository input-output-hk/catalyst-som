<template>
  <div>
    <nav-bar />
    <o-notification
      v-if="activeMsg"
      closable
      variant="warning"
      aria-close-label="Close notification"
      role="alert">
        This is a test environment. All the information in this platform are intended only for testing purpose.
        Feel free to submit SoM / PoA / Reviews and signoff. Please use <a href="https://forms.gle/KmSkWqa1Ua6UUQr28" target="_blank">this form</a>
        to submit feedback and bug reports.
    </o-notification>
    <router-view></router-view>
    <m-footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/components/shared/NavBar.vue'
import MFooter from '@/components/shared/MFooter.vue'

const activeMsg = ref(false)
</script>

<style lang="scss">
@use "sass:list";
.scrollable-modal {
  //overflow: auto !important;
 // max-height: 90vh
}

.html-text {
  white-space: pre-wrap;
  ul, ol {
    @for $i from 1 through 6 {
      li.ql-indent-#{$i} {
        margin-left: 1.2em * $i;
      }
    }
  }
  ol {
    list-style-type: none !important;
    margin-left: 1em !important;
    $list-types: lower-alpha lower-roman decimal;
    & > li {
      &:first-child {
        counter-reset: list-0;
      }
      & {
        counter-increment: list-0;
      }
      &:before {
        content: counter(list-0, decimal) '. '
      }
      &:not(.ql-indent-1) + .ql-indent-1 {
        counter-reset: list-1;
      }
    }
    @for $i from 1 through 6 {
      @for $j from 1 through ($i - 1) {
        li.ql-indent-#{$j}:not(li.ql-indent-#{$i}) + li.ql-indent-#{$i} {
          counter-reset: list-#{$i};
        }
      }
      
      li.ql-indent-#{$i} {
        counter-increment: list-#{$i};
      }
      li.ql-indent-#{$i}:before {
        content: counter(list-#{$i}, list.nth($list-types, (($i - 1) % 3) + 1)) '. '
      }
    }
  }
}

</style>
