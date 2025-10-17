export default ({ env }) => ({
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
  seo: {
    enabled: true
  }
});
