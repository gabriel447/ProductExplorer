<script setup lang="ts">
// Componente de resumo de produto
// Responsabilidades: exibir imagem, título e preço de um produto
import type { Product } from '@/types/Product'
defineProps<{ product: Product }>()
</script>

<template>
  <div class="summary">
    <div class="image-wrap">
      <img :src="product.image" :alt="product.title" class="image" />
    </div>
    <div class="info">
      <slot name="category" />
      <h2 class="title" :title="product.title">{{ product.title }}</h2>
      <slot name="rating" />
      <div class="price-row">
        <div class="price">
          {{
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              product.price,
            )
          }}
        </div>
      </div>
      <slot name="description" />
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;
}
@media (max-width: 700px) {
  .summary {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
.summary {
  max-width: 680px;
  margin: 0 auto;
}
.image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  min-height: 320px;
}
.image {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
}
.info {
  display: grid;
  gap: 12px;
  padding: 12px;
  grid-auto-rows: max-content;
}
.price-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 0;
}
.title {
  font-size: var(--font-detail-title-size);
  line-height: var(--line-tight);
  margin: 0;
}
.price {
  font-size: var(--font-detail-price-size);
  font-weight: 700;
  color: #111;
  margin-top: 0;
}

@media (max-width: 480px) {
  .summary {
    gap: 16px;
  }
  .image-wrap {
    padding: 12px 8px 8px;
    min-height: 260px;
  }
  .image {
    display: block;
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
  }
  .info {
    padding: 8px;
  }
  .title {
    font-size: 18px;
    line-height: 1.3;
  }
}
</style>
