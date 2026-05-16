# Contributing to Retain AI

Thank you for your interest in contributing to Retain AI! This document provides guidelines and instructions for contributing.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/retain-ai.git
   cd retain-ai
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run development server**:
   ```bash
   npm run dev
   ```

## Project Structure

Please review [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) to understand the codebase organization.

## Development Guidelines

### Code Style

- **TypeScript**: Use strict typing, avoid `any` when possible
- **Formatting**: Run `npm run format` before committing
- **Linting**: Ensure `npm run lint` passes
- **Components**: Use functional components with hooks
- **Naming**: Use descriptive names (camelCase for variables, PascalCase for components)

### File Organization

- **Components**: Place in `/components` with appropriate subdirectory
- **Utilities**: Add to `/lib` with clear purpose
- **Types**: Define shared types in `/types`
- **Documentation**: Update `/docs` for significant changes

### Import Guidelines

Use path aliases:
```typescript
// Good
import { Button } from '@/components/ui/button';
import { generateAnalyticsSummary } from '@/lib/analytics';

// Avoid
import { Button } from '../../components/ui/button';
```

### AI System

- **New Features**: Use `/lib/ai` system
- **Legacy Code**: Reference `/lib/legacy` but don't extend it
- **Heuristics**: Add PM heuristics to `/lib/ai/intelligence/pmHeuristics.ts`
- **Builders**: Create new builders in `/lib/ai/builders/`

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Use prefixes:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

### 2. Make Your Changes

- Write clean, documented code
- Add comments for complex logic
- Update types as needed
- Test your changes thoroughly

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Format code
npm run format

# Build project
npm run build

# Test locally
npm run dev
```

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add new retention metric"
git commit -m "fix: resolve CSV parsing issue"
git commit -m "docs: update API documentation"
```

Format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Tests
- `chore:` - Maintenance

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference any related issues
- Screenshots for UI changes
- Test results

## Pull Request Guidelines

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Types are properly defined
- [ ] No console errors or warnings
- [ ] Responsive design (if UI changes)
- [ ] Accessibility considered
- [ ] Performance impact assessed

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

## Code Review Process

1. **Automated Checks**: CI/CD runs linting and builds
2. **Peer Review**: At least one approval required
3. **Testing**: Reviewer tests changes locally
4. **Merge**: Squash and merge to main branch

## Adding New Features

### Analytics Features

1. Add computation to `/lib/analytics.ts`
2. Update `AnalyticsSummary` type in `/types/analytics.ts`
3. Document in `/docs/ANALYTICS_ENGINE.md`
4. Add tests if applicable

### AI Insights

1. Create builder in `/lib/ai/builders/`
2. Add heuristics to `/lib/ai/intelligence/pmHeuristics.ts`
3. Update orchestrator in `/lib/ai/orchestrator.ts`
4. Document in `/lib/ai/README.md`

### UI Components

1. Create component in `/components`
2. Use shadcn/ui components as base
3. Follow design system in `/docs/design-system.md`
4. Ensure responsive and accessible
5. Add to Storybook (if available)

## Documentation

### When to Update Docs

- New features or APIs
- Changed behavior
- Configuration updates
- Architecture changes

### Documentation Files

- `README.md` - Project overview
- `docs/ANALYTICS_ENGINE.md` - Analytics system
- `docs/PROJECT_STRUCTURE.md` - Codebase structure
- `docs/design-system.md` - UI/UX guidelines
- `lib/ai/README.md` - AI system documentation

## Testing

### Manual Testing

1. Upload various CSV files
2. Test all insight categories
3. Verify responsive design
4. Check dark/light themes
5. Test error handling

### Future: Automated Testing

We plan to add:
- Unit tests (Jest)
- Integration tests
- E2E tests (Playwright)
- Visual regression tests

## Common Issues

### Import Errors

- Ensure path aliases are correct (`@/`)
- Check `tsconfig.json` paths configuration

### Build Errors

- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Type Errors

- Update types in `/types` directory
- Ensure imports reference correct type files

## Getting Help

- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Email**: magithar8@gmail.com

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Retain AI! 🚀