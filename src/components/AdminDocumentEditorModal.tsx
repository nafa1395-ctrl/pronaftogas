import React, { useState } from 'react';
import {
  Check,
  Edit3,
  FileText,
  Lock,
  RotateCcw,
  Save,
  Sparkles,
  X,
} from 'lucide-react';
import { KhatamProposalDocument } from '../data/khatamProposalsData';
import { COMPANY_RESUME_DATA, DOCUMENT_META } from '../data/protocolData';

export type CompanyResumeType = typeof COMPANY_RESUME_DATA;
export type DocumentMetaType = typeof DOCUMENT_META;

interface AdminDocumentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: KhatamProposalDocument;
  companyResume: CompanyResumeType;
  documentMeta: DocumentMetaType;
  onSaveAll: (
    updatedProposal: KhatamProposalDocument,
    updatedCompanyResume: CompanyResumeType,
    updatedDocMeta: DocumentMetaType
  ) => void;
  onResetCurrentProposal: () => void;
}

type EditorTab =
  | 'letterhead'
  | 'company'
  | 'instructor'
  | 'chapter1'
  | 'chapter2'
  | 'chapter3'
  | 'chapter456';

export const AdminDocumentEditorModal: React.FC<
  AdminDocumentEditorModalProps
> = ({
  isOpen,
  onClose,
  proposal,
  companyResume,
  documentMeta,
  onSaveAll,
  onResetCurrentProposal,
}) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('letterhead');
  const [draftProposal, setDraftProposal] =
    useState<KhatamProposalDocument>(proposal);
  const [draftCompany, setDraftCompany] =
    useState<CompanyResumeType>(companyResume);
  const [draftMeta, setDraftMeta] = useState<DocumentMetaType>(documentMeta);
  const [savedNotice, setSavedNotice] = useState(false);

  React.useEffect(() => {
    setDraftProposal(proposal);
  }, [proposal]);

  React.useEffect(() => {
    setDraftCompany(companyResume);
  }, [companyResume]);

  React.useEffect(() => {
    setDraftMeta(documentMeta);
  }, [documentMeta]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAll(draftProposal, draftCompany, draftMeta);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="bg-[#1D4760] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#37A3DC] flex items-center justify-center shrink-0">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                پنل مدیریت و ویرایش متنی سند — {draftProposal.recipientShortOnCover}
              </h2>
              <p className="text-xs text-sky-200">
                تمامی تغییرات متنی در هر دو نمای «وب تعاملی» و «کاتالوگ چاپی ۲۲ صفحه‌ای A4» اعمال و ذخیره می‌شوند
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetCurrentProposal}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="بازگردانی متون این پروپوزال به حالت پیش‌فرض"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی پیش‌فرض</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              title="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="bg-[#F8FAFC] border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center gap-1.5 shrink-0">
          {(
            [
              { id: 'letterhead', label: '۱. روی جلد و نامه رسمی' },
              { id: 'company', label: '۲. رزومه شرکت اوج' },
              { id: 'instructor', label: '۳. رزومه مدرس' },
              { id: 'chapter1', label: '۴. فصل اول (شناخت و چالش‌ها)' },
              { id: 'chapter2', label: '۵. فصل دوم (الگوها، KPI و ROI)' },
              { id: 'chapter3', label: '۶. فصل سوم (۶ فاز CPMAI)' },
              { id: 'chapter456', label: '۷. سرفصل‌ها و سرمایه‌گذاری' },
            ] as { id: EditorTab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#1D4760] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto p-6 space-y-6 text-sm"
        >
          {activeTab === 'letterhead' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D4760] block">
                    عنوان اصلی روی جلد (Cover Main Title):
                  </label>
                  <input
                    type="text"
                    value={draftProposal.coverMainTitle}
                    onChange={(e) =>
                      setDraftProposal({
                        ...draftProposal,
                        coverMainTitle: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D4760] block">
                    عنوان کوتاه مخاطب روی جلد و هدر صفحات:
                  </label>
                  <input
                    type="text"
                    value={draftProposal.recipientShortOnCover}
                    onChange={(e) =>
                      setDraftProposal({
                        ...draftProposal,
                        recipientShortOnCover: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D4760] block">
                    زیرعنوان بالای صفحه (Cover Subtitle):
                  </label>
                  <input
                    type="text"
                    value={draftProposal.coverSubtitle}
                    onChange={(e) =>
                      setDraftProposal({
                        ...draftProposal,
                        coverSubtitle: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-[#1D4760] block">
                      شماره نامه / کد سند:
                    </label>
                    <input
                      type="text"
                      value={draftProposal.letterNumber}
                      onChange={(e) =>
                        setDraftProposal({
                          ...draftProposal,
                          letterNumber: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono-num text-slate-800 focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-[#1D4760] block">
                      تاریخ نامه:
                    </label>
                    <input
                      type="text"
                      value={draftProposal.letterDate}
                      onChange={(e) =>
                        setDraftProposal({
                          ...draftProposal,
                          letterDate: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#1D4760] block">
                  مخاطب نامه رسمی (به:):
                </label>
                <input
                  type="text"
                  value={draftProposal.recipientTitle}
                  onChange={(e) =>
                    setDraftProposal({
                      ...draftProposal,
                      recipientTitle: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#1D4760] block">
                  فرستنده نامه رسمی (از:):
                </label>
                <input
                  type="text"
                  value={draftProposal.senderTitle}
                  onChange={(e) =>
                    setDraftProposal({
                      ...draftProposal,
                      senderTitle: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#1D4760] block">
                  موضوع پروپوزال (موضوع:):
                </label>
                <textarea
                  rows={2}
                  value={draftProposal.subject}
                  onChange={(e) =>
                    setDraftProposal({
                      ...draftProposal,
                      subject: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 leading-relaxed focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#1D4760] block">
                  پیش‌درآمد مدیریتی و هدف محوری پروپوزال (Executive Lead):
                </label>
                <textarea
                  rows={5}
                  value={draftProposal.executiveLead}
                  onChange={(e) =>
                    setDraftProposal({
                      ...draftProposal,
                      executiveLead: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D4760] block">
                    نام رسمی شرکت (فارسی):
                  </label>
                  <input
                    type="text"
                    value={draftCompany.titleFa}
                    onChange={(e) =>
                      setDraftCompany({
                        ...draftCompany,
                        titleFa: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D4760] block">
                    نام شرکت (انگلیسی):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={draftCompany.titleEn}
                    onChange={(e) =>
                      setDraftCompany({
                        ...draftCompany,
                        titleEn: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-latin font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#1D4760] block">
                  شعار و جایگاه تخصصی شرکت (Tagline):
                </label>
                <input
                  type="text"
                  value={draftCompany.tagline}
                  onChange={(e) =>
                    setDraftCompany({
                      ...draftCompany,
                      tagline: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#1D4760] block">
                  متن معرفی جامع شرکت مشاوران مدیریت کسب و کار اوج:
                </label>
                <textarea
                  rows={4}
                  value={draftCompany.executiveIntro}
                  onChange={(e) =>
                    setDraftCompany({
                      ...draftCompany,
                      executiveIntro: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 leading-relaxed"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h3 className="text-xs font-black text-[#0284C7]">
                  ارکان چهارگانه خدمات تخصصی شرکت اوج:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {draftCompany.corePillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => {
                          const next = [...draftCompany.corePillars];
                          next[idx] = { ...next[idx], title: e.target.value };
                          setDraftCompany({ ...draftCompany, corePillars: next });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900"
                      />
                      <textarea
                        rows={3}
                        value={pillar.description}
                        onChange={(e) => {
                          const next = [...draftCompany.corePillars];
                          next[idx] = {
                            ...next[idx],
                            description: e.target.value,
                          };
                          setDraftCompany({ ...draftCompany, corePillars: next });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h3 className="text-xs font-black text-[#0284C7]">
                  تمایز رقابتی شرکت اوج در برگزاری بوت‌کمپ‌های PMI-CPMAI v8:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {draftCompany.whyOwjForCpmai.map((adv, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <input
                        type="text"
                        value={adv.title}
                        onChange={(e) => {
                          const next = [...draftCompany.whyOwjForCpmai];
                          next[idx] = { ...next[idx], title: e.target.value };
                          setDraftCompany({
                            ...draftCompany,
                            whyOwjForCpmai: next,
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900"
                      />
                      <textarea
                        rows={3}
                        value={adv.description}
                        onChange={(e) => {
                          const next = [...draftCompany.whyOwjForCpmai];
                          next[idx] = {
                            ...next[idx],
                            description: e.target.value,
                          };
                          setDraftCompany({
                            ...draftCompany,
                            whyOwjForCpmai: next,
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'instructor' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D4760] block">
                    نام و نام خانوادگی مدرس دوره:
                  </label>
                  <input
                    type="text"
                    value={draftMeta.instructorName}
                    onChange={(e) =>
                      setDraftMeta({
                        ...draftMeta,
                        instructorName: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D4760] block">
                    سمت سازمانی مدرس:
                  </label>
                  <input
                    type="text"
                    value={draftMeta.instructorRole}
                    onChange={(e) =>
                      setDraftMeta({
                        ...draftMeta,
                        instructorRole: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#1D4760] block">
                  شرح جایگاه علمی و مرجعیت بین‌المللی مدرس (۱۳ گواهینامه هوش مصنوعی PMI/Cognilytica):
                </label>
                <textarea
                  rows={4}
                  value={draftMeta.instructorDistinction}
                  onChange={(e) =>
                    setDraftMeta({
                      ...draftMeta,
                      instructorDistinction: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#1D4760] block">
                  نام سازمان / شرکت در هدر و فوتر صفحات:
                </label>
                <input
                  type="text"
                  value={draftMeta.organization}
                  onChange={(e) =>
                    setDraftMeta({
                      ...draftMeta,
                      organization: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                />
              </div>
            </div>
          )}

          {activeTab === 'chapter1' && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#1D4760] block">
                  عنوان فصل اول (شناخت راهبردی هلدینگ):
                </label>
                <input
                  type="text"
                  value={draftProposal.strategicContextTitle}
                  onChange={(e) =>
                    setDraftProposal({
                      ...draftProposal,
                      strategicContextTitle: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#1D4760] block">
                  متن تحلیلی فصل اول (Strategic Context Lead):
                </label>
                <textarea
                  rows={4}
                  value={draftProposal.strategicContextLead}
                  onChange={(e) =>
                    setDraftProposal({
                      ...draftProposal,
                      strategicContextLead: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 leading-relaxed"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-xs font-black text-[#0284C7] block">
                  محورهای تخصصی و حوزه‌های راهبردی مورد تمرکز در هلدینگ:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {draftProposal.keyEntitiesAndSites.map((domain, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={domain}
                      onChange={(e) => {
                        const next = [...draftProposal.keyEntitiesAndSites];
                        next[idx] = e.target.value;
                        setDraftProposal({
                          ...draftProposal,
                          keyEntitiesAndSites: next,
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h3 className="text-xs font-black text-[#0284C7]">
                  چالش‌های چهارگانه راهبردی هلدینگ:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {draftProposal.challenges.map((ch, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <input
                        type="text"
                        value={ch.title}
                        onChange={(e) => {
                          const next = [...draftProposal.challenges];
                          next[idx] = { ...next[idx], title: e.target.value };
                          setDraftProposal({
                            ...draftProposal,
                            challenges: next,
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900"
                      />
                      <textarea
                        rows={3}
                        value={ch.description}
                        onChange={(e) => {
                          const next = [...draftProposal.challenges];
                          next[idx] = {
                            ...next[idx],
                            description: e.target.value,
                          };
                          setDraftProposal({
                            ...draftProposal,
                            challenges: next,
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chapter2' && (
            <div className="space-y-5">
              <div className="space-y-3">
                <h3 className="text-xs font-black text-[#0284C7]">
                  الگوهای هفت‌گانه هوش مصنوعی (7 AI Patterns):
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {draftProposal.aiPatterns.map((pat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <input
                        type="text"
                        value={pat.titleFa}
                        onChange={(e) => {
                          const next = [...draftProposal.aiPatterns];
                          next[idx] = { ...next[idx], titleFa: e.target.value };
                          setDraftProposal({
                            ...draftProposal,
                            aiPatterns: next,
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900"
                      />
                      <textarea
                        rows={3}
                        value={pat.description}
                        onChange={(e) => {
                          const next = [...draftProposal.aiPatterns];
                          next[idx] = {
                            ...next[idx],
                            description: e.target.value,
                          };
                          setDraftProposal({
                            ...draftProposal,
                            aiPatterns: next,
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h3 className="text-xs font-black text-[#0284C7]">
                  تحلیل بازگشت سرمایه (ROI) و امکان‌سنجی:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      برآورد منافع مستقیم سالانه:
                    </label>
                    <textarea
                      rows={3}
                      value={draftProposal.roiAnalysis.annualSavings}
                      onChange={(e) =>
                        setDraftProposal({
                          ...draftProposal,
                          roiAnalysis: {
                            ...draftProposal.roiAnalysis,
                            annualSavings: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      منافع استراتژیک و فرهنگی:
                    </label>
                    <textarea
                      rows={3}
                      value={draftProposal.roiAnalysis.intangibleBenefits}
                      onChange={(e) =>
                        setDraftProposal({
                          ...draftProposal,
                          roiAnalysis: {
                            ...draftProposal.roiAnalysis,
                            intangibleBenefits: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chapter3' && (
            <div className="space-y-5">
              <h3 className="text-xs font-black text-[#0284C7]">
                کاربرگ ۶ فاز متدولوژی PMI-CPMAI v8:
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {draftProposal.cpmaiPhases.map((phase, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={phase.titleFa}
                        onChange={(e) => {
                          const next = [...draftProposal.cpmaiPhases];
                          next[idx] = { ...next[idx], titleFa: e.target.value };
                          setDraftProposal({
                            ...draftProposal,
                            cpmaiPhases: next,
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900"
                        placeholder="عنوان فارسی فاز"
                      />
                      <input
                        type="text"
                        value={phase.summary}
                        onChange={(e) => {
                          const next = [...draftProposal.cpmaiPhases];
                          next[idx] = { ...next[idx], summary: e.target.value };
                          setDraftProposal({
                            ...draftProposal,
                            cpmaiPhases: next,
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800"
                        placeholder="هدف فاز"
                      />
                      <input
                        type="text"
                        value={phase.deliverable}
                        onChange={(e) => {
                          const next = [...draftProposal.cpmaiPhases];
                          next[idx] = {
                            ...next[idx],
                            deliverable: e.target.value,
                          };
                          setDraftProposal({
                            ...draftProposal,
                            cpmaiPhases: next,
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-[#0284C7]"
                        placeholder="خروجی فاز"
                      />
                    </div>
                    <div className="space-y-1.5">
                      {phase.bullets.map((b, bIdx) => (
                        <textarea
                          key={bIdx}
                          rows={2}
                          value={b}
                          onChange={(e) => {
                            const nextPhases = [...draftProposal.cpmaiPhases];
                            const nextBullets = [...nextPhases[idx].bullets];
                            nextBullets[bIdx] = e.target.value;
                            nextPhases[idx] = {
                              ...nextPhases[idx],
                              bullets: nextBullets,
                            };
                            setDraftProposal({
                              ...draftProposal,
                              cpmaiPhases: nextPhases,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 leading-relaxed"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chapter456' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D4760] block">
                    مدت زمان دوره (یکسان در سطوح):
                  </label>
                  <input
                    type="text"
                    value={draftProposal.totalHours}
                    onChange={(e) =>
                      setDraftProposal({
                        ...draftProposal,
                        totalHours: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D4760] block">
                    قالب برگزاری جلسات:
                  </label>
                  <input
                    type="text"
                    value={draftProposal.sessionsFormat}
                    onChange={(e) =>
                      setDraftProposal({
                        ...draftProposal,
                        sessionsFormat: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D4760] block">
                    نرخ حق‌الزحمه تدریس (به ازای هر ساعت):
                  </label>
                  <input
                    type="text"
                    value={draftProposal.investment.hourlyRate}
                    onChange={(e) =>
                      setDraftProposal({
                        ...draftProposal,
                        investment: {
                          ...draftProposal.investment,
                          hourlyRate: e.target.value,
                          totalAmount: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold text-[#0284C7]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D4760] block">
                    شرح حروفی نرخ سرمایه‌گذاری:
                  </label>
                  <input
                    type="text"
                    value={draftProposal.investment.totalAmountWords}
                    onChange={(e) =>
                      setDraftProposal({
                        ...draftProposal,
                        investment: {
                          ...draftProposal.investment,
                          totalAmountWords: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#1D4760] block">
                  متن فصل چهارم (فرهنگ‌سازی سازمانی و ابزارهای آموزشی ابری):
                </label>
                <textarea
                  rows={4}
                  value={draftProposal.airGappedNote}
                  onChange={(e) =>
                    setDraftProposal({
                      ...draftProposal,
                      airGappedNote: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 leading-relaxed"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h3 className="text-xs font-black text-[#0284C7]">
                  سرفصل ماژول‌های کارگاهی (۹۶ ساعت):
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {draftProposal.modules.map((mod, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) => {
                            const next = [...draftProposal.modules];
                            next[idx] = { ...next[idx], title: e.target.value };
                            setDraftProposal({
                              ...draftProposal,
                              modules: next,
                            });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900"
                        />
                        <input
                          type="text"
                          value={mod.hours}
                          onChange={(e) => {
                            const next = [...draftProposal.modules];
                            next[idx] = { ...next[idx], hours: e.target.value };
                            setDraftProposal({
                              ...draftProposal,
                              modules: next,
                            });
                          }}
                          className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-[#0284C7]"
                        />
                      </div>
                      <textarea
                        rows={3}
                        value={mod.description}
                        onChange={(e) => {
                          const next = [...draftProposal.modules];
                          next[idx] = {
                            ...next[idx],
                            description: e.target.value,
                          };
                          setDraftProposal({
                            ...draftProposal,
                            modules: next,
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sticky Footer inside Form */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Sparkles className="w-4 h-4 text-[#0284C7]" />
              <span>
                نکته: علاوه بر این پنل، می‌توانید با فعال کردن «ویرایش مستقیم روی صفحه» روی هر متنی در سند کلیک کرده و مستقیماً تایپ نمایید.
              </span>
            </div>

            <div className="flex items-center gap-3">
              {savedNotice && (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>تغییرات با موفقیت ذخیره شد!</span>
                </span>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                بستن پنجره
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره تغییرات در سند</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
