import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { contactPageService } from '../../services';

const ContactPageManager = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingStat, setEditingStat] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await contactPageService.getContactPage();
      setContent(data);
    } catch (error) {
      toast.error('Failed to load contact page content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Remove fields that shouldn't be sent to backend
      const { created_at, created_by, updated_at, updated_by, _id, ...cleanContent } = content;

      const response = await contactPageService.updateContactPage(cleanContent);

      // Update local state with response from server
      setContent(response);

      toast.success('Contact page updated successfully! Changes are now live on the website.');
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);

      // Properly format error message
      let errorMessage = 'Failed to update contact page';

      if (error.response?.data?.detail) {
        // If detail is an array of validation errors
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map(err =>
            `${err.loc?.join(' → ') || 'Field'}: ${err.msg}`
          ).join(', ');
        }
        // If detail is an object
        else if (typeof error.response.data.detail === 'object') {
          errorMessage = JSON.stringify(error.response.data.detail, null, 2);
        }
        // If detail is a string
        else {
          errorMessage = String(error.response.data.detail);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset to default content? This cannot be undone.')) {
      try {
        setSaving(true);
        const data = await contactPageService.resetContactPage();
        setContent(data.content);
        toast.success('Contact page reset to default');
      } catch (error) {
        toast.error('Failed to reset contact page');
      } finally {
        setSaving(false);
      }
    }
  };

  const updateNestedField = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addFAQ = () => {
    const newFaq = {
      id: content.faq.questions.length + 1,
      question: 'New Question',
      answer: 'New Answer'
    };
    setContent(prev => ({
      ...prev,
      faq: {
        ...prev.faq,
        questions: [...prev.faq.questions, newFaq]
      }
    }));
  };

  const updateFAQ = (index, field, value) => {
    const questions = [...content.faq.questions];
    questions[index][field] = value;
    setContent(prev => ({
      ...prev,
      faq: {
        ...prev.faq,
        questions
      }
    }));
  };

  const deleteFAQ = (index) => {
    const questions = content.faq.questions.filter((_, i) => i !== index);
    setContent(prev => ({
      ...prev,
      faq: {
        ...prev.faq,
        questions
      }
    }));
  };

  const addContactCard = () => {
    const newCard = {
      id: content.contactInfo.cards.length + 1,
      icon: 'Mail',
      label: 'New Contact',
      value: 'contact@example.com',
      href: 'mailto:contact@example.com',
      description: 'Description'
    };
    setContent(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        cards: [...prev.contactInfo.cards, newCard]
      }
    }));
  };

  const updateContactCard = (index, field, value) => {
    const cards = [...content.contactInfo.cards];
    cards[index][field] = value;
    setContent(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        cards
      }
    }));
  };

  const deleteContactCard = (index) => {
    const cards = content.contactInfo.cards.filter((_, i) => i !== index);
    setContent(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        cards
      }
    }));
  };

  const addSchedule = () => {
    const newSchedule = {
      day: 'New Day',
      hours: '9:00 AM - 5:00 PM',
      available: true
    };
    setContent(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        schedule: [...prev.businessHours.schedule, newSchedule]
      }
    }));
  };

  const updateSchedule = (index, field, value) => {
    const schedule = [...content.businessHours.schedule];
    schedule[index][field] = value;
    setContent(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        schedule
      }
    }));
  };

  const deleteSchedule = (index) => {
    const schedule = content.businessHours.schedule.filter((_, i) => i !== index);
    setContent(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        schedule
      }
    }));
  };

  const addStat = () => {
    const newStat = {
      value: '0+',
      label: 'New Stat'
    };
    setContent(prev => ({
      ...prev,
      cta: {
        ...prev.cta,
        stats: [...prev.cta.stats, newStat]
      }
    }));
  };

  const updateStat = (index, field, value) => {
    const stats = [...content.cta.stats];
    stats[index][field] = value;
    setContent(prev => ({
      ...prev,
      cta: {
        ...prev.cta,
        stats
      }
    }));
  };

  const deleteStat = (index) => {
    const stats = content.cta.stats.filter((_, i) => i !== index);
    setContent(prev => ({
      ...prev,
      cta: {
        ...prev.cta,
        stats
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto" data-testid="contact-page-manager">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Page Manager</h1>
          <p className="text-gray-600 mt-1">Edit all content on the Contact page</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleReset} variant="outline" disabled={saving}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} disabled={saving} data-testid="save-button">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-brand-700">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={content.hero.title}
                onChange={(e) => updateNestedField('hero', 'title', e.target.value)}
                placeholder="Get in Touch"
                data-testid="hero-title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={content.hero.subtitle}
                onChange={(e) => updateNestedField('hero', 'subtitle', e.target.value)}
                placeholder="Let's discuss your project"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.hero.description}
                onChange={(e) => updateNestedField('hero', 'description', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Form Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-brand-700">Contact Form</h2>
          <div className="space-y-4">
            <div>
              <Label>Form Title</Label>
              <Input
                value={content.form.title}
                onChange={(e) => updateNestedField('form', 'title', e.target.value)}
              />
            </div>
            <div>
              <Label>Form Subtitle</Label>
              <Input
                value={content.form.subtitle}
                onChange={(e) => updateNestedField('form', 'subtitle', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Submit Button Text</Label>
                <Input
                  value={content.form.submitButton.text}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    form: {
                      ...prev.form,
                      submitButton: {
                        ...prev.form.submitButton,
                        text: e.target.value
                      }
                    }
                  }))}
                />
              </div>
              <div>
                <Label>Loading Text</Label>
                <Input
                  value={content.form.submitButton.loadingText}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    form: {
                      ...prev.form,
                      submitButton: {
                        ...prev.form.submitButton,
                        loadingText: e.target.value
                      }
                    }
                  }))}
                />
              </div>
              <div>
                <Label>Success Text</Label>
                <Input
                  value={content.form.submitButton.successText}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    form: {
                      ...prev.form,
                      submitButton: {
                        ...prev.form.submitButton,
                        successText: e.target.value
                      }
                    }
                  }))}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Information Cards */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-brand-700">Contact Information</h2>
            <Button onClick={addContactCard} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>
          <div className="space-y-4 mb-4">
            <div>
              <Label>Section Title</Label>
              <Input
                value={content.contactInfo.title}
                onChange={(e) => updateNestedField('contactInfo', 'title', e.target.value)}
              />
            </div>
            <div>
              <Label>Section Subtitle</Label>
              <Input
                value={content.contactInfo.subtitle}
                onChange={(e) => updateNestedField('contactInfo', 'subtitle', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4">
            {content.contactInfo.cards.map((card, index) => (
              <Card key={card.id} className="p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-semibold text-gray-700">Card {index + 1}</span>
                  <Button
                    onClick={() => deleteContactCard(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Icon (e.g., Mail, Phone, Clock, MapPin)</Label>
                    <Input
                      value={card.icon}
                      onChange={(e) => updateContactCard(index, 'icon', e.target.value)}
                      placeholder="Mail"
                    />
                  </div>
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={card.label}
                      onChange={(e) => updateContactCard(index, 'label', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Value</Label>
                    <Input
                      value={card.value}
                      onChange={(e) => updateContactCard(index, 'value', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Link (optional)</Label>
                    <Input
                      value={card.href || ''}
                      onChange={(e) => updateContactCard(index, 'href', e.target.value)}
                      placeholder="mailto:email@example.com"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Description</Label>
                    <Input
                      value={card.description}
                      onChange={(e) => updateContactCard(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Business Hours */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-brand-700">Business Hours</h2>
            <Button onClick={addSchedule} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </div>
          <div className="space-y-4 mb-4">
            <div>
              <Label>Section Title</Label>
              <Input
                value={content.businessHours.title}
                onChange={(e) => updateNestedField('businessHours', 'title', e.target.value)}
              />
            </div>
            <div>
              <Label>Timezone</Label>
              <Input
                value={content.businessHours.timezone}
                onChange={(e) => updateNestedField('businessHours', 'timezone', e.target.value)}
              />
            </div>
            <div>
              <Label>Note</Label>
              <Input
                value={content.businessHours.note}
                onChange={(e) => updateNestedField('businessHours', 'note', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-3">
            {content.businessHours.schedule.map((schedule, index) => (
              <Card key={index} className="p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-semibold text-gray-700">Schedule {index + 1}</span>
                  <Button
                    onClick={() => deleteSchedule(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Day</Label>
                    <Input
                      value={schedule.day}
                      onChange={(e) => updateSchedule(index, 'day', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Hours</Label>
                    <Input
                      value={schedule.hours}
                      onChange={(e) => updateSchedule(index, 'hours', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Available</Label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={schedule.available}
                      onChange={(e) => updateSchedule(index, 'available', e.target.value === 'true')}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* FAQ Section */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-brand-700">Frequently Asked Questions</h2>
            <Button onClick={addFAQ} size="sm" data-testid="add-faq-button">
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </div>
          <div className="space-y-4 mb-4">
            <div>
              <Label>FAQ Title</Label>
              <Input
                value={content.faq.title}
                onChange={(e) => updateNestedField('faq', 'title', e.target.value)}
              />
            </div>
            <div>
              <Label>FAQ Subtitle</Label>
              <Input
                value={content.faq.subtitle}
                onChange={(e) => updateNestedField('faq', 'subtitle', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4">
            {content.faq.questions.map((faq, index) => (
              <Card key={faq.id} className="p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-semibold text-gray-700">FAQ {index + 1}</span>
                  <Button
                    onClick={() => deleteFAQ(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    data-testid={`delete-faq-${index}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Question</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      placeholder="What is your question?"
                      data-testid={`faq-question-${index}`}
                    />
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      rows={3}
                      placeholder="Answer goes here..."
                      data-testid={`faq-answer-${index}`}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-brand-700">Call-to-Action Section</h2>
            <Button onClick={addStat} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Stat
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <Label>CTA Title</Label>
              <Input
                value={content.cta.title}
                onChange={(e) => updateNestedField('cta', 'title', e.target.value)}
              />
            </div>
            <div>
              <Label>CTA Subtitle</Label>
              <Input
                value={content.cta.subtitle}
                onChange={(e) => updateNestedField('cta', 'subtitle', e.target.value)}
              />
            </div>
            <div>
              <Label>CTA Description</Label>
              <Textarea
                value={content.cta.description}
                onChange={(e) => updateNestedField('cta', 'description', e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Primary Button Text</Label>
                <Input
                  value={content.cta.primaryButton.text}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    cta: {
                      ...prev.cta,
                      primaryButton: {
                        ...prev.cta.primaryButton,
                        text: e.target.value
                      }
                    }
                  }))}
                />
              </div>
              <div>
                <Label>Primary Button Link</Label>
                <Input
                  value={content.cta.primaryButton.link}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    cta: {
                      ...prev.cta,
                      primaryButton: {
                        ...prev.cta.primaryButton,
                        link: e.target.value
                      }
                    }
                  }))}
                />
              </div>
              <div>
                <Label>Secondary Button Text</Label>
                <Input
                  value={content.cta.secondaryButton.text}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    cta: {
                      ...prev.cta,
                      secondaryButton: {
                        ...prev.cta.secondaryButton,
                        text: e.target.value
                      }
                    }
                  }))}
                />
              </div>
              <div>
                <Label>Secondary Button Link</Label>
                <Input
                  value={content.cta.secondaryButton.link}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    cta: {
                      ...prev.cta,
                      secondaryButton: {
                        ...prev.cta.secondaryButton,
                        link: e.target.value
                      }
                    }
                  }))}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label className="mb-2 block">Statistics</Label>
              <div className="space-y-3">
                {content.cta.stats.map((stat, index) => (
                  <Card key={index} className="p-3 bg-gray-50 flex items-center gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Value</Label>
                        <Input
                          value={stat.value}
                          onChange={(e) => updateStat(index, 'value', e.target.value)}
                          placeholder="35+"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Label</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => updateStat(index, 'label', e.target.value)}
                          placeholder="Happy Clients"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => deleteStat(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button at Bottom */}
        <div className="flex justify-end gap-3 sticky bottom-4">
          <Button onClick={handleReset} variant="outline" disabled={saving}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactPageManager;
