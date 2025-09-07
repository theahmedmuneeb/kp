export default ({ env }) => ({
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        baseUrl: env("S3_PUBLIC_URL"),
        s3Options: {
          endpoint: env("S3_ENDPOINT", ""),
          region: env("S3_REGION", "auto"),
          forcePathStyle: true,
          credentials: {
            accessKeyId: env("S3_ACCESS_KEY_ID"),
            secretAccessKey: env("S3_ACCESS_SECRET"),
          },
        },
        params: {
          Bucket: env("S3_BUCKET"),
        },
        endpoint: env("S3_ENDPOINT"),
        s3ForcePathStyle: true,
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  "auto-slug-manager": {
    enabled: true,
    config: {
      sourceField: "title",
      fallbackField: "name",
      handleRichText: false,
      addSuffixForUnique: true,
      supportCyrillic: true,
      updateExistingSlugs: false,
      slugifyOptions: {
        lower: true,
        strict: true,
        locale: "en",
      },
    },
  },
  "webp-converter": {
    enabled: true,
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST"),
        port: env.int("SMTP_PORT", 465),
        secure: true,
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
      },
      settings: {
        defaultFrom: env("SMTP_DEFAULT_FROM"),
        defaultReplyTo: env("SMTP_DEFAULT_REPLY_TO"),
      },
    },
  },
});
