<template>
  <div v-if="withdraws?.length > 0" class="is-size-7">
    <p>{{ $t('signoff_withdraw.title_list') }}</p>
    <ul>
      <li v-for="w in withdraws" :key="w">
        {{$d(w.created_at, 'long_compact')}}<br/>{{ $t('signoff_withdraw.originally_signed_at') }} {{$d(w.original_signed_off_at, 'long_compact')}}
        <span v-if="w.signer?.email">{{ $t('signoff_withdraw.originally_signed_by', {email: w.signer.email}) }}</span>
        <br/><span v-if="w.user?.email">{{ $t('signoff_withdraw.withdrawn_by', {email: w.user.email}) }}</span>
      </li>
    </ul>
  </div>
  
</template>

<script setup>
defineProps({
  withdraws: {
    type: Array,
    default: () => []
  },
})
</script>

