<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ContentPreview from '@/components/ContentPreview.vue'
import FormField from '@/components/FormField.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import WorkflowBar from '@/components/WorkflowBar.vue'
import { CONTENT_TYPES } from '@/data/contentTypes'
import { PERMISSIONS } from '@/data/roles'
import { canEditFields, STATUS } from '@/data/workflow'
import { useAuthStore } from '@/stores/authStore'
import { useContentStore } from '@/stores/contentStore'
import { validateContent, validateNavigation } from '@/utils/validate'

const props = defineProps({
  type: { type: String, required: true },
  id: { type: String, default: '' },
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const contentStore = useContentStore()

const spec = computed(() => CONTENT_TYPES[props.type])
const isCollection = computed(() => spec.value.collection)
const isNew = computed(() => isCollection.value && (props.id === 'new' || route.params.id === 'new'))

const form = reactive({})
const errors = reactive({})
const message = ref('')
const publishedHint = ref('')

const item = computed(() => contentStore.current)
const status = computed(() => (isNew.value ? STATUS.DRAFT : item.value?.status ?? STATUS.DRAFT))
const locked = computed(() => !canEditFields(status.value, authStore.can(PERMISSIONS.CMS_DRAFT)))
const busy = computed(() => contentStore.status === 'loading')

function assignForm(source) {
  const blank = spec.value.empty()
  Object.keys(form).forEach((key) => delete form[key])
  Object.assign(form, blank, source ?? {})
  if (props.type === 'navigation' && !form.links) form.links = []
}

function clearErrors() {
  Object.keys(errors).forEach((key) => delete errors[key])
}

function validate() {
  clearErrors()
  const next =
    props.type === 'navigation' ? validateNavigation(form) : validateContent(form, spec.value.fields)
  Object.assign(errors, next)
  return Object.keys(next).length === 0
}

function payload() {
  const skip = new Set(['id', 'status', 'updatedAt', 'updatedBy', 'history'])
  return Object.fromEntries(Object.entries(form).filter(([key]) => !skip.has(key)))
}

async function load() {
  publishedHint.value = ''
  if (isNew.value) {
    contentStore.current = null
    assignForm()
    return
  }

  try {
    const record = await contentStore.loadOne(props.type, props.id || props.type)
    assignForm(record)
  } catch {
    assignForm()
  }
}

onMounted(load)
watch(() => [props.type, props.id, route.params.id], load)

async function saveDraft() {
  if (!validate()) return
  message.value = ''
  try {
    if (isNew.value) {
      const created = await contentStore.create(props.type, payload())
      message.value = 'Draft saved.'
      await router.replace({ name: `${props.type}-edit`, params: { id: created.id } })
      return
    }
    await contentStore.save(props.type, payload(), item.value.id)
    assignForm(contentStore.current)
    message.value = 'Draft saved.'
  } catch (error) {
    message.value = error.message
  }
}

async function onWorkflow(action) {
  message.value = ''
  publishedHint.value = ''
  try {
    const result = await contentStore.transition(props.type, item.value.id, action)
    assignForm(result.item)
    message.value = `Status is now ${result.item.status}.`
    if (action === 'publish') {
      publishedHint.value =
        'Published snapshot written to client/public/cms-published.json. Refresh http://localhost:5173 to see the client site.'
    }
  } catch (error) {
    message.value = error.message
  }
}

function addLink() {
  form.links = [...(form.links ?? []), { label: '', hash: '' }]
}

function removeLink(index) {
  form.links = form.links.filter((_, i) => i !== index)
}

function fieldClass(key) {
  return errors[key] ? 'form-control is-invalid' : 'form-control'
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <RouterLink v-if="isCollection" class="small" :to="{ name: type }">← All {{ spec.label.toLowerCase() }}</RouterLink>
        <h1 class="h3 fw-bold mb-1 mt-1">{{ isNew ? `New ${spec.singular}` : spec.label }}</h1>
        <p class="mb-0">
          <StatusBadge :status="status" />
          <span v-if="item?.updatedBy" class="small text-body-secondary ms-2">
            {{ item.updatedBy }} · {{ item.updatedAt?.replace('T', ' ').slice(0, 16) }}
          </span>
        </p>
      </div>
    </div>

    <div v-if="contentStore.status === 'error' && !isNew" class="alert alert-danger">
      {{ contentStore.error?.message }}
    </div>
    <div v-else-if="message" class="alert" :class="contentStore.status === 'error' ? 'alert-danger' : 'alert-success'">
      {{ message }}
    </div>
    <div v-if="publishedHint" class="alert alert-info">{{ publishedHint }}</div>

    <div class="row g-4">
      <div class="col-lg-7">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <template v-if="type !== 'navigation'">
              <div v-for="field in spec.fields" :key="field.key" class="mb-3">
                <FormField :label="field.label" :for-id="field.key" :error="errors[field.key]" :hint="field.hint">
                  <select
                    v-if="field.type === 'select'"
                    :id="field.key"
                    v-model="form[field.key]"
                    class="form-select"
                    :class="{ 'is-invalid': errors[field.key] }"
                    :disabled="locked"
                  >
                    <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
                  </select>
                  <textarea
                    v-else-if="field.type === 'textarea'"
                    :id="field.key"
                    v-model="form[field.key]"
                    rows="4"
                    :class="fieldClass(field.key)"
                    :disabled="locked"
                  />
                  <input
                    v-else
                    :id="field.key"
                    v-model="form[field.key]"
                    :type="field.type === 'date' ? 'date' : 'text'"
                    :class="fieldClass(field.key)"
                    :disabled="locked"
                  />
                </FormField>
              </div>
            </template>

            <template v-else>
              <p v-if="errors.links" class="text-danger small">{{ errors.links }}</p>
              <div v-for="(link, index) in form.links || []" :key="index" class="row g-2 mb-2">
                <div class="col-md-4">
                  <input v-model="link.label" class="form-control" placeholder="Label" :disabled="locked" />
                </div>
                <div class="col-md-4">
                  <input v-model="link.hash" class="form-control" placeholder="#hash" :disabled="locked" />
                </div>
                <div class="col-md-3">
                  <input v-model="link.name" class="form-control" placeholder="route name" :disabled="locked" />
                </div>
                <div class="col-md-1">
                  <button type="button" class="btn btn-outline-danger" :disabled="locked" @click="removeLink(index)">
                    ×
                  </button>
                </div>
              </div>
              <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="locked" @click="addLink">
                Add link
              </button>
            </template>

            <div class="d-flex flex-wrap gap-2 mt-4">
              <button
                v-if="authStore.can(PERMISSIONS.CMS_DRAFT)"
                type="button"
                class="btn btn-primary"
                :disabled="locked || busy"
                @click="saveDraft"
              >
                Save draft
              </button>
              <WorkflowBar v-if="!isNew && item" :status="status" :busy="busy" @action="onWorkflow" />
            </div>
            <p v-if="locked && !isNew" class="small text-body-secondary mt-3 mb-0">
              Fields lock after submit. Return the item to draft (reviewer or admin) before editing again.
            </p>
          </div>
        </div>

        <div v-if="item?.history?.length" class="card border-0 shadow-sm mt-4">
          <div class="card-body">
            <h2 class="h6">History</h2>
            <ul class="small mb-0">
              <li v-for="(entry, index) in item.history" :key="index">
                {{ entry.at.replace('T', ' ').slice(0, 16) }} · {{ entry.by }} · {{ entry.action }}
                <span v-if="entry.to"> → {{ entry.to }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <ContentPreview :type="type" :item="form" />
        <p class="small text-body-secondary mt-3">
          Preview is how the client would render this item. Shoppers only see
          <strong>published</strong> content after Admin clicks Publish.
        </p>
      </div>
    </div>
  </div>
</template>
