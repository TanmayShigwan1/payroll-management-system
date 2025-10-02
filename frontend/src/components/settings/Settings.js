import React, { useState, useContext } from 'react';
import { Card, Row, Col, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { CurrencyContext } from '../../contexts/CurrencyContext';
import { toast } from 'react-toastify';

/**
 * Settings component.
 * Allows administrators to configure system settings.
 */
const Settings = () => {
  const { currency, setCurrency } = useContext(CurrencyContext);
  const [settings, setSettings] = useState({
    companyName: 'Payroll Management System',
    companyAddress: 'Mumbai, Maharashtra, India',
    companyPhone: '+91-9876543210',
    companyEmail: 'admin@payrollsystem.com',
    taxRate: 30,
    overtimeRate: 1.5,
    workingHoursPerWeek: 40,
    payFrequency: 'monthly',
    defaultCurrency: currency,
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real application, you would send this to the backend
    console.log('Saving settings:', settings);
    
    // Update currency context if it changed
    if (settings.defaultCurrency !== currency) {
      setCurrency(settings.defaultCurrency);
    }
    
    toast.success('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    setSettings({
      companyName: 'Payroll Management System',
      companyAddress: 'Mumbai, Maharashtra, India',
      companyPhone: '+91-9876543210',
      companyEmail: 'admin@payrollsystem.com',
      taxRate: 30,
      overtimeRate: 1.5,
      workingHoursPerWeek: 40,
      payFrequency: 'monthly',
      defaultCurrency: 'INR',
      emailNotifications: true,
      smsNotifications: false,
      autoBackup: true,
      backupFrequency: 'daily'
    });
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="settings">
      <h2 className="mb-4">Settings</h2>
      
      <Tabs defaultActiveKey="company" className="mb-4">
        <Tab eventKey="company" title="Company Information">
          <Card>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={settings.companyEmail}
                      onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={settings.companyAddress}
                      onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={settings.companyPhone}
                      onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="payroll" title="Payroll Settings">
          <Card>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Default Tax Rate (%)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.taxRate}
                      onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Overtime Rate Multiplier</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      step="0.1"
                      value={settings.overtimeRate}
                      onChange={(e) => handleInputChange('overtimeRate', parseFloat(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Working Hours per Week</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="168"
                      value={settings.workingHoursPerWeek}
                      onChange={(e) => handleInputChange('workingHoursPerWeek', parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pay Frequency</Form.Label>
                    <Form.Select
                      value={settings.payFrequency}
                      onChange={(e) => handleInputChange('payFrequency', e.target.value)}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Default Currency</Form.Label>
                    <Form.Select
                      value={settings.defaultCurrency}
                      onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="notifications" title="Notifications">
          <Card>
            <Card.Body>
              <Alert variant="info">
                <i className="bi bi-info-circle me-2"></i>
                Configure notification preferences for payroll processing and system updates.
              </Alert>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Email Notifications"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                />
                <Form.Text className="text-muted">
                  Receive email notifications for payroll processing and system updates.
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="SMS Notifications"
                  checked={settings.smsNotifications}
                  onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                />
                <Form.Text className="text-muted">
                  Receive SMS notifications for critical system alerts.
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="backup" title="Backup & Security">
          <Card>
            <Card.Body>
              <Alert variant="warning">
                <i className="bi bi-shield-exclamation me-2"></i>
                Configure backup and security settings to protect your payroll data.
              </Alert>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Auto Backup"
                  checked={settings.autoBackup}
                  onChange={(e) => handleInputChange('autoBackup', e.target.checked)}
                />
                <Form.Text className="text-muted">
                  Automatically backup payroll data at regular intervals.
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Backup Frequency</Form.Label>
                <Form.Select
                  value={settings.backupFrequency}
                  onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                  disabled={!settings.autoBackup}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Form.Select>
              </Form.Group>
              
              <div className="d-flex gap-2">
                <Button variant="outline-primary">
                  <i className="bi bi-download me-2"></i>
                  Create Manual Backup
                </Button>
                <Button variant="outline-secondary">
                  <i className="bi bi-upload me-2"></i>
                  Restore from Backup
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
      
      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={handleResetSettings}>
          Reset to Defaults
        </Button>
        <Button variant="primary" onClick={handleSaveSettings}>
          <i className="bi bi-save me-2"></i>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;