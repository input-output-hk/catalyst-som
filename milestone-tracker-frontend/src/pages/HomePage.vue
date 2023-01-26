<template>
  <section class="section">
    <div class="content columns is-multiline">
      <div class="column is-7">
        <h1 class="is-size-1" v-html="$t('pages.home.title')"></h1>
      </div>
      <div class="column is-12">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae suscipit sapien, in maximus lacus. Maecenas vestibulum vulputate libero, ut volutpat augue porttitor nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus vitae hendrerit orci, sit amet molestie purus. Sed posuere ultricies ante a finibus. Sed sed lacinia libero. Ut iaculis vehicula fringilla. Mauris molestie neque nec nisi porta commodo eget non ex. Pellentesque gravida sodales ligula egestas vehicula. Sed cursus eget justo sit amet fermentum. Ut blandit ut leo rhoncus auctor. Morbi diam lectus, molestie at tempus vel, dignissim sed mauris. Sed lobortis vestibulum lacus, iaculis mattis mauris convallis ac. Praesent sit amet ante sed neque fermentum dapibus. Nulla at felis elementum, consequat dui id, ultrices eros. Nam sed congue lacus, quis mattis mi.</p>
        <p class="has-text-centered">
          <router-link v-slot="{ navigate }" class="discover-proposals" to="/proposals">
            <o-button variant="primary" size="large" @click="navigate">
              {{ $t('pages.home.discover') }}
            </o-button>
          </router-link>
        </p>
      </div>
      <div class="column is-7">
        <h1 class="is-size-2">{{ $t('pages.home.how') }}</h1>
      </div>
      <div class="column is-12">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae suscipit sapien, in maximus lacus. Maecenas vestibulum vulputate libero, ut volutpat augue porttitor nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus vitae hendrerit orci, sit amet molestie purus. Sed posuere ultricies ante a finibus. Sed sed lacinia libero. Ut iaculis vehicula fringilla. Mauris molestie neque nec nisi porta commodo eget non ex. Pellentesque gravida sodales ligula egestas vehicula. Sed cursus eget justo sit amet fermentum. Ut blandit ut leo rhoncus auctor. Morbi diam lectus, molestie at tempus vel, dignissim sed mauris. Sed lobortis vestibulum lacus, iaculis mattis mauris convallis ac. Praesent sit amet ante sed neque fermentum dapibus. Nulla at felis elementum, consequat dui id, ultrices eros. Nam sed congue lacus, quis mattis mi.</p>
      </div>
      <div class="column is-7">
        <h1 class="is-size-2">{{ $t('pages.home.faq') }}</h1>
      </div>
      <div class="column is-12 mb-6">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae suscipit sapien, in maximus lacus. Maecenas vestibulum vulputate libero, ut volutpat augue porttitor nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus vitae hendrerit orci, sit amet molestie purus. Sed posuere ultricies ante a finibus. Sed sed lacinia libero. Ut iaculis vehicula fringilla. Mauris molestie neque nec nisi porta commodo eget non ex. Pellentesque gravida sodales ligula egestas vehicula. Sed cursus eget justo sit amet fermentum. Ut blandit ut leo rhoncus auctor. Morbi diam lectus, molestie at tempus vel, dignissim sed mauris. Sed lobortis vestibulum lacus, iaculis mattis mauris convallis ac. Praesent sit amet ante sed neque fermentum dapibus. Nulla at felis elementum, consequat dui id, ultrices eros. Nam sed congue lacus, quis mattis mi.</p>
      </div>
    </div>
  </section>
</template>
