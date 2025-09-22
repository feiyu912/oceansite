/// <reference types="next" />

declare namespace NodeJS {
  interface ProcessEnv {
    /** NOAA CO-OPS API Token，可选 */
    NEXT_PUBLIC_NOAA_TOKEN?: string;
    /** GBIF API Token，可选 */
    NEXT_PUBLIC_GBIF_TOKEN?: string;
    /** Hakai CSV 数据 URL（服务器拉取） */
    HAKAI_REEF_CSV_URL?: string;
    /** 站点 URL，用于 SEO */
    NEXT_PUBLIC_SITE_URL?: string;
  }
}


