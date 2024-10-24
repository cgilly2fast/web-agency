import { default as default_0 } from '@/lib/fields/FirmField/components/index'
import { OverviewComponent as OverviewComponent_1 } from '@payloadcms/plugin-seo/client'
import { MetaTitleComponent as MetaTitleComponent_2 } from '@payloadcms/plugin-seo/client'
import { MetaDescriptionComponent as MetaDescriptionComponent_3 } from '@payloadcms/plugin-seo/client'
import { MetaImageComponent as MetaImageComponent_4 } from '@payloadcms/plugin-seo/client'
import { PreviewComponent as PreviewComponent_5 } from '@payloadcms/plugin-seo/client'
import { RichTextCell as RichTextCell_6 } from '@payloadcms/richtext-lexical/client'
import { RichTextField as RichTextField_7 } from '@payloadcms/richtext-lexical/client'
import { getGenerateComponentMap as getGenerateComponentMap_8 } from '@payloadcms/richtext-lexical/generateComponentMap'
import { InlineToolbarFeatureClient as InlineToolbarFeatureClient_9 } from '@payloadcms/richtext-lexical/client'
import { HorizontalRuleFeatureClient as HorizontalRuleFeatureClient_10 } from '@payloadcms/richtext-lexical/client'
import { UploadFeatureClient as UploadFeatureClient_11 } from '@payloadcms/richtext-lexical/client'
import { BlockquoteFeatureClient as BlockquoteFeatureClient_12 } from '@payloadcms/richtext-lexical/client'
import { RelationshipFeatureClient as RelationshipFeatureClient_13 } from '@payloadcms/richtext-lexical/client'
import { LinkFeatureClient as LinkFeatureClient_14 } from '@payloadcms/richtext-lexical/client'
import { ChecklistFeatureClient as ChecklistFeatureClient_15 } from '@payloadcms/richtext-lexical/client'
import { OrderedListFeatureClient as OrderedListFeatureClient_16 } from '@payloadcms/richtext-lexical/client'
import { UnorderedListFeatureClient as UnorderedListFeatureClient_17 } from '@payloadcms/richtext-lexical/client'
import { IndentFeatureClient as IndentFeatureClient_18 } from '@payloadcms/richtext-lexical/client'
import { AlignFeatureClient as AlignFeatureClient_19 } from '@payloadcms/richtext-lexical/client'
import { HeadingFeatureClient as HeadingFeatureClient_20 } from '@payloadcms/richtext-lexical/client'
import { ParagraphFeatureClient as ParagraphFeatureClient_21 } from '@payloadcms/richtext-lexical/client'
import { InlineCodeFeatureClient as InlineCodeFeatureClient_22 } from '@payloadcms/richtext-lexical/client'
import { SuperscriptFeatureClient as SuperscriptFeatureClient_23 } from '@payloadcms/richtext-lexical/client'
import { SubscriptFeatureClient as SubscriptFeatureClient_24 } from '@payloadcms/richtext-lexical/client'
import { StrikethroughFeatureClient as StrikethroughFeatureClient_25 } from '@payloadcms/richtext-lexical/client'
import { UnderlineFeatureClient as UnderlineFeatureClient_26 } from '@payloadcms/richtext-lexical/client'
import { BoldFeatureClient as BoldFeatureClient_27 } from '@payloadcms/richtext-lexical/client'
import { ItalicFeatureClient as ItalicFeatureClient_28 } from '@payloadcms/richtext-lexical/client'
import { default as default_29 } from '@/components/GlobalTitle'
import { default as default_30 } from '@/components/MyCalendarsDescription'
import { default as default_31 } from '@/components/AvailabilityRowLabel'
import { DynamicFieldSelector as DynamicFieldSelector_32 } from '@payloadcms/plugin-form-builder/client'
import { DynamicPriceSelector as DynamicPriceSelector_33 } from '@payloadcms/plugin-form-builder/client'
import { FixedToolbarFeatureClient as FixedToolbarFeatureClient_34 } from '@payloadcms/richtext-lexical/client'
import { default as default_35 } from '@/components/BufferTimeRowLabel'
import { default as default_36 } from '@/components/MinNoticeRowLabel'
import { default as default_37 } from '@/components/DailyLimitRowLabel'
import { default as default_38 } from '@/components/TimezoneDisplayRowLabel'
import { default as default_39 } from '@/components/IncrementsRowLabel'
import { default as default_40 } from '@/components/BookingPageUrlPreview'
import { default as default_41 } from '@/components/CustomMeetingFormBlockLabel'
import { default as default_42 } from '@/components/TimingReminderRowLabel'
import { default as default_43 } from '@/components/TimingFollowUpRowLabel'
import { default as default_44 } from '@/components/ProfilePicture'
import { default as default_45 } from '@/components/Nav/index'
import { default as default_46 } from '@/graphics/Icon/index'
import { default as default_47 } from '@/graphics/Logo/index'
import { default as default_48 } from '@/components/GoogleOAuthButton'
import { default as default_49 } from '@/providers/DirectDocumentProvider'
import { default as default_50 } from '@/views/Chat/index'
import { default as default_51 } from '@/views/Integrations/index'
import { default as default_52 } from '@/views/Dashboard/index'

export const importMap = {
  "@/lib/fields/FirmField/components/index#default": default_0,
  "@payloadcms/plugin-seo/client#OverviewComponent": OverviewComponent_1,
  "@payloadcms/plugin-seo/client#MetaTitleComponent": MetaTitleComponent_2,
  "@payloadcms/plugin-seo/client#MetaDescriptionComponent": MetaDescriptionComponent_3,
  "@payloadcms/plugin-seo/client#MetaImageComponent": MetaImageComponent_4,
  "@payloadcms/plugin-seo/client#PreviewComponent": PreviewComponent_5,
  "@payloadcms/richtext-lexical/client#RichTextCell": RichTextCell_6,
  "@payloadcms/richtext-lexical/client#RichTextField": RichTextField_7,
  "@payloadcms/richtext-lexical/generateComponentMap#getGenerateComponentMap": getGenerateComponentMap_8,
  "@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient": InlineToolbarFeatureClient_9,
  "@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient": HorizontalRuleFeatureClient_10,
  "@payloadcms/richtext-lexical/client#UploadFeatureClient": UploadFeatureClient_11,
  "@payloadcms/richtext-lexical/client#BlockquoteFeatureClient": BlockquoteFeatureClient_12,
  "@payloadcms/richtext-lexical/client#RelationshipFeatureClient": RelationshipFeatureClient_13,
  "@payloadcms/richtext-lexical/client#LinkFeatureClient": LinkFeatureClient_14,
  "@payloadcms/richtext-lexical/client#ChecklistFeatureClient": ChecklistFeatureClient_15,
  "@payloadcms/richtext-lexical/client#OrderedListFeatureClient": OrderedListFeatureClient_16,
  "@payloadcms/richtext-lexical/client#UnorderedListFeatureClient": UnorderedListFeatureClient_17,
  "@payloadcms/richtext-lexical/client#IndentFeatureClient": IndentFeatureClient_18,
  "@payloadcms/richtext-lexical/client#AlignFeatureClient": AlignFeatureClient_19,
  "@payloadcms/richtext-lexical/client#HeadingFeatureClient": HeadingFeatureClient_20,
  "@payloadcms/richtext-lexical/client#ParagraphFeatureClient": ParagraphFeatureClient_21,
  "@payloadcms/richtext-lexical/client#InlineCodeFeatureClient": InlineCodeFeatureClient_22,
  "@payloadcms/richtext-lexical/client#SuperscriptFeatureClient": SuperscriptFeatureClient_23,
  "@payloadcms/richtext-lexical/client#SubscriptFeatureClient": SubscriptFeatureClient_24,
  "@payloadcms/richtext-lexical/client#StrikethroughFeatureClient": StrikethroughFeatureClient_25,
  "@payloadcms/richtext-lexical/client#UnderlineFeatureClient": UnderlineFeatureClient_26,
  "@payloadcms/richtext-lexical/client#BoldFeatureClient": BoldFeatureClient_27,
  "@payloadcms/richtext-lexical/client#ItalicFeatureClient": ItalicFeatureClient_28,
  "@/components/GlobalTitle#default": default_29,
  "@/components/MyCalendarsDescription#default": default_30,
  "@/components/AvailabilityRowLabel#default": default_31,
  "@payloadcms/plugin-form-builder/client#DynamicFieldSelector": DynamicFieldSelector_32,
  "@payloadcms/plugin-form-builder/client#DynamicPriceSelector": DynamicPriceSelector_33,
  "@payloadcms/richtext-lexical/client#FixedToolbarFeatureClient": FixedToolbarFeatureClient_34,
  "@/components/BufferTimeRowLabel#default": default_35,
  "@/components/MinNoticeRowLabel#default": default_36,
  "@/components/DailyLimitRowLabel#default": default_37,
  "@/components/TimezoneDisplayRowLabel#default": default_38,
  "@/components/IncrementsRowLabel#default": default_39,
  "@/components/BookingPageUrlPreview#default": default_40,
  "@/components/CustomMeetingFormBlockLabel#default": default_41,
  "@/components/TimingReminderRowLabel#default": default_42,
  "@/components/TimingFollowUpRowLabel#default": default_43,
  "@/components/ProfilePicture#default": default_44,
  "@/components/Nav/index#default": default_45,
  "@/graphics/Icon/index#default": default_46,
  "@/graphics/Logo/index#default": default_47,
  "@/components/GoogleOAuthButton#default": default_48,
  "@/providers/DirectDocumentProvider#default": default_49,
  "@/views/Chat/index#default": default_50,
  "@/views/Integrations/index#default": default_51,
  "@/views/Dashboard/index#default": default_52
}
