import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    LinearProgress,
    Chip,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Grid
} from '@mui/material';
import {
    CheckCircle,
    Cancel,
    Warning,
    TrendingUp,
    School,
    Work,
    Code,
    LocationOn,
    LightbulbOutlined
} from '@mui/icons-material';

const JobCompatibilityModal = ({ open, onClose, compatibilityData, onApply, onCancel }) => {
    if (!compatibilityData) return null;

    const {
        jobTitle,
        company,
        overallScore,
        isRecommended,
        recommendation,
        feedback,
        suggestions,
        mismatchReasons,
        detailedMatch
    } = compatibilityData;

    const getScoreColor = (score) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'error';
    };

    const getScoreIcon = (score) => {
        if (score >= 80) return <CheckCircle color="success" />;
        if (score >= 60) return <Warning color="warning" />;
        return <Cancel color="error" />;
    };

    const ScoreSection = ({ title, score, icon, details }) => (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {icon}
                <Typography variant="subtitle2" sx={{ ml: 1, flex: 1 }}>
                    {title}
                </Typography>
                <Chip
                    label={`${score}%`}
                    color={getScoreColor(score)}
                    size="small"
                    icon={getScoreIcon(score)}
                />
            </Box>
            <LinearProgress
                variant="determinate"
                value={score}
                color={getScoreColor(score)}
                sx={{ height: 8, borderRadius: 4 }}
            />
            {details && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
                    {details}
                </Typography>
            )}
        </Box>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                    Job Compatibility Analysis
                </Box>
                <Box component="div" sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 0.5 }}>
                    {jobTitle} at {company}
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {/* Overall Score */}
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Typography variant="h4" color={getScoreColor(overallScore)}>
                        {overallScore}%
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Overall Match Score
                    </Typography>
                    <Chip
                        label={isRecommended ? 'Recommended' : overallScore >= 50 ? 'Possible Match' : 'Poor Match'}
                        color={isRecommended ? 'success' : overallScore >= 50 ? 'warning' : 'error'}
                        sx={{ mt: 1 }}
                    />
                </Box>

                {/* Recommendation */}
                <Alert
                    severity={isRecommended ? 'success' : overallScore >= 50 ? 'warning' : 'error'}
                    sx={{ mb: 3 }}
                >
                    <Typography variant="body2">
                        {recommendation}
                    </Typography>
                </Alert>

                {/* Detailed Breakdown */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Detailed Analysis
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <ScoreSection
                            title="Experience Match"
                            score={detailedMatch.experience.score}
                            icon={<Work color="primary" />}
                            details={`Required: ${detailedMatch.experience.required} | Your Experience: ${detailedMatch.experience.candidate}`}
                        />

                        <ScoreSection
                            title="Skills Match"
                            score={detailedMatch.skills.score}
                            icon={<Code color="primary" />}
                            details={`${detailedMatch.skills.matched.length}/${detailedMatch.skills.totalRequired} skills matched`}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <ScoreSection
                            title="Education Match"
                            score={detailedMatch.education.score}
                            icon={<School color="primary" />}
                            details={detailedMatch.education.hasRequirement ? "Education requirements found" : "No specific requirements"}
                        />

                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <LocationOn color="primary" />
                                <Typography variant="subtitle2" sx={{ ml: 1, flex: 1 }}>
                                    Location Match
                                </Typography>
                                {detailedMatch.location.match ? (
                                    <CheckCircle color="success" />
                                ) : (
                                    <Cancel color="error" />
                                )}
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                Required: {detailedMatch.location.required} | Your Location: {detailedMatch.location.candidate || 'Not specified'}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Skills Breakdown */}
                {detailedMatch.skills.matched.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" color="success.main" sx={{ mb: 1 }}>
                            ✓ Matching Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {detailedMatch.skills.matched.map((skill, index) => (
                                <Chip
                                    key={index}
                                    label={skill}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                {detailedMatch.skills.missing.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" color="error.main" sx={{ mb: 1 }}>
                            ✗ Missing Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {detailedMatch.skills.missing.map((skill, index) => (
                                <Chip
                                    key={index}
                                    label={skill}
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Feedback */}
                {feedback && feedback.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Specific Feedback:
                        </Typography>
                        <List dense>
                            {feedback.map((item, index) => (
                                <ListItem key={index} sx={{ pl: 0 }}>
                                    <ListItemIcon>
                                        <Warning color="warning" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item}
                                        primaryTypographyProps={{ variant: 'body2' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {/* Comprehensive Mismatch Reasons from Backend */}
                {mismatchReasons && mismatchReasons.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: 'error.main', display: 'flex', alignItems: 'center' }}>
                            <Warning sx={{ mr: 1 }} />
                            Detailed Profile Analysis:
                        </Typography>

                        <List dense>
                            {mismatchReasons.map((reason, index) => {
                                const getSeverityColor = (severity) => {
                                    switch (severity) {
                                        case 'high': return 'error';
                                        case 'medium': return 'warning';
                                        case 'low': return 'info';
                                        default: return 'default';
                                    }
                                };

                                const getCategoryIcon = (category) => {
                                    switch (category) {
                                        case 'experience': return <Work />;
                                        case 'skills': return <Code />;
                                        case 'education': return <School />;
                                        case 'location': return <LocationOn />;
                                        default: return <Warning />;
                                    }
                                };

                                return (
                                    <ListItem key={index} sx={{ pl: 0, alignItems: 'flex-start', mb: 1 }}>
                                        <ListItemIcon>
                                            {getCategoryIcon(reason.category)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {reason.type}
                                                    </Typography>
                                                    <Chip
                                                        label={reason.severity}
                                                        size="small"
                                                        color={getSeverityColor(reason.severity)}
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            }
                                            secondary={reason.impact || 'This may affect your application success rate.'}
                                            secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                )}

                {/* Detailed Mismatch Reasons */}
                {!isRecommended && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: 'error.main', display: 'flex', alignItems: 'center' }}>
                            <Warning sx={{ mr: 1 }} />
                            Why Your Profile Doesn't Match:
                        </Typography>

                        <List dense>
                            {/* Experience Mismatch */}
                            {!detailedMatch.experience.match && (
                                <ListItem sx={{ pl: 0, alignItems: 'flex-start' }}>
                                    <ListItemIcon>
                                        <Work color="error" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Experience Requirements Not Met"
                                        secondary={`Required: ${detailedMatch.experience.required} | Your Experience: ${detailedMatch.experience.candidate}`}
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                        secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                                    />
                                </ListItem>
                            )}

                            {/* Skills Mismatch */}
                            {detailedMatch.skills.missing.length > 0 && (
                                <ListItem sx={{ pl: 0, alignItems: 'flex-start' }}>
                                    <ListItemIcon>
                                        <Code color="error" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`Missing ${detailedMatch.skills.missing.length} Required Skills`}
                                        secondary={`Skills needed: ${detailedMatch.skills.missing.join(', ')}`}
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                        secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                                    />
                                </ListItem>
                            )}

                            {/* Education Mismatch */}
                            {detailedMatch.education.score < 70 && detailedMatch.education.hasRequirement && (
                                <ListItem sx={{ pl: 0, alignItems: 'flex-start' }}>
                                    <ListItemIcon>
                                        <School color="error" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Education Requirements May Not Be Met"
                                        secondary="Your educational background may not fully align with job requirements"
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                        secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                                    />
                                </ListItem>
                            )}

                            {/* Location Mismatch */}
                            {!detailedMatch.location.match && (
                                <ListItem sx={{ pl: 0, alignItems: 'flex-start' }}>
                                    <ListItemIcon>
                                        <LocationOn color="error" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Location Preference Doesn't Match"
                                        secondary={`Job Location: ${detailedMatch.location.required} | Your Location: ${detailedMatch.location.candidate || 'Not specified'}`}
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                        secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                                    />
                                </ListItem>
                            )}
                        </List>

                        {/* Warning about applying anyway */}
                        {overallScore < 50 && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    <strong>Apply with caution:</strong> Your profile significantly differs from job requirements.
                                    Consider improving your skills and experience before applying to increase your chances of success.
                                </Typography>
                            </Alert>
                        )}
                    </Box>
                )}

                {/* Improvement Suggestions */}
                {suggestions && suggestions.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <LightbulbOutlined sx={{ mr: 1, color: 'primary.main' }} />
                            Improvement Suggestions:
                        </Typography>
                        <List dense>
                            {suggestions.map((suggestion, index) => (
                                <ListItem key={index} sx={{ pl: 0 }}>
                                    <ListItemText
                                        primary={suggestion.message}
                                        secondary={`Priority: ${suggestion.priority}`}
                                        primaryTypographyProps={{ variant: 'body2' }}
                                        secondaryTypographyProps={{ variant: 'caption' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onCancel} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={onApply}
                    variant="contained"
                    color={isRecommended ? 'primary' : overallScore >= 50 ? 'warning' : 'error'}
                >
                    {isRecommended ? 'Apply Now' : overallScore >= 50 ? 'Apply Anyway' : 'Apply Despite Poor Match'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default JobCompatibilityModal;